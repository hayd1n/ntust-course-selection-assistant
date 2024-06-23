import TimetableBody from "./timetable-body.svelte";
import TimetableCell from "./timetable-cell.svelte";
import TimetableHead from "./timetable-head.svelte";
import TimetableHeader from "./timetable-header.svelte";
import TimetableRow from "./timetable-row.svelte";
import Timetable from "./timetable.svelte";

const Root = Timetable;
const Header = TimetableHeader;
const Body = TimetableBody;
const Row = TimetableRow;
const Head = TimetableHead;
const Cell = TimetableCell;

export { Root, Header, Body, Row, Head, Cell };
