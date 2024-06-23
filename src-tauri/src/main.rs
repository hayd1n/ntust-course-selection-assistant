// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures::future::join_all;
use once_cell::sync::Lazy;
use q::{merge_courses, CourseInfo, Language};
use serde::Serialize;
use std::{borrow::Borrow, sync::Arc};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;
use tauri::{async_runtime::Mutex, Manager};
use webbrowser::{open_browser, Browser};

const PKG_NAME: &str = env!("CARGO_PKG_NAME");
const PKG_VERSION: &str = env!("CARGO_PKG_VERSION");

static CLIENT: Lazy<q::Q> = Lazy::new(|| {
    q::ClientBuilder::new()
        .user_agent(format!("{}/{}", PKG_NAME, PKG_VERSION).as_str())
        .build()
        .unwrap()
});

#[tauri::command]
fn open_url(url: &str) {
    if open_browser(Browser::Default, &url).is_ok() {
        println!("open url: {}", &url)
    }
}

#[tauri::command]
async fn search_course(
    app_handle: tauri::AppHandle,
    semester: &str,
    language: Language,
    text: &str,
) -> Result<(), String> {
    #[derive(Debug, EnumIter)]
    enum SearchMode {
        Number,
        Name,
        Teacher,
    }

    let app_handle_arc = Arc::new(app_handle);
    let all_results = Arc::new(Mutex::new(Vec::<CourseInfo>::new()));

    let futures = SearchMode::iter().map(|mode| {
        let app_handle_arc = app_handle_arc.clone();
        let all_results_clone = all_results.clone();

        let mut options = q::SearchOptions::new(semester, language);

        match mode {
            SearchMode::Number => options.course_no = String::from(text),
            SearchMode::Name => options.course_name = String::from(text),
            SearchMode::Teacher => options.course_teacher = String::from(text),
        };

        async move {
            let mut result = match CLIENT.search(options.borrow(), true).await {
                Ok(r) => r,
                Err(e) => return Err(e.to_string()),
            };

            // merge the results
            let mut all_results_clone = all_results_clone.lock().await;
            let mut new_all_results = all_results_clone.clone();
            new_all_results.append(&mut result);
            new_all_results = merge_courses(new_all_results);

            // sort the results
            new_all_results.sort_by_key(|course| course.course_no.clone());
            *all_results_clone = new_all_results;

            #[derive(Debug, Serialize, Clone)]
            struct Payload {
                text: String,
                results: Vec<CourseInfo>,
            }

            let _ = app_handle_arc.get_window("main").unwrap().emit(
                "search-update",
                Payload {
                    text: String::from(text),
                    results: all_results_clone.clone(),
                },
            );

            Ok(())
        }
    });

    join_all(futures).await;

    Ok(())
}

#[tauri::command]
async fn query_course(
    semester: &str,
    language: Language,
    course_no: &str,
) -> Result<q::CourseDetails, String> {
    match CLIENT.query(semester, course_no, language).await {
        Ok(r) => Ok(r),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_context_menu::init())
        .invoke_handler(tauri::generate_handler![
            open_url,
            search_course,
            query_course
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
