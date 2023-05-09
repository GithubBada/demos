import {useEffect, useRef, useState} from "react";

interface Column {
    header: string;
    accessor: string;
}

interface Props {
    columns: Column[];
    data: any[];
    leftFixedColumns?: number;
    rightFixedColumns?: number;
    pageSize?: number;
}

interface HandlePaginationProps{
    handlePageChange: (page: number) => void;
    handleRowsPerPageChange: (value: number) => void;
    totalPages: number;
    currentPage: number;
    rowsPerPage: number;
}

/**
 * Table pagination
 * @param handlePageChange
 * @param handleRowsPerPageChange
 * @param totalPages
 * @param currentPage
 * @param rowsPerPage
 * @constructor
 */
function Pagination({handlePageChange, handleRowsPerPageChange, totalPages, currentPage, rowsPerPage}: HandlePaginationProps) {
    const [pageSizeState, setPageSize] = useState(rowsPerPage);
       return (
               <div>
                   <span className="pagination-content">
                       <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            {'<'}
                        </button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
                            {page}
                        </button>
                    ))}
                       <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            {'>'}
                        </button>
                   </span>
                   <span style={{fontSize: 16}}>PageSize: <input value={pageSizeState} onChange={(e)=>{
                       const newValue = e.target.value.replace(/\D/g, '');
                       if(!newValue) return;
                       setPageSize(parseInt(newValue))
                   }} style={{ width: 50, height: 20}} /></span>
                   <button onClick={() => handleRowsPerPageChange(pageSizeState)} style={{ height: 26, marginLeft: 10}}>OK</button>
               </div>
       )
}

interface HandleTableProps{
    columns: Column[];
    handleSort: (column: string, newOrder: "asc" | "desc") => void;
    visibleData: any[];
    sortColumn: string;
    sortOrder: "asc" | "desc",
    leftFixedColumns: number,
    rightFixedColumns: number,
    totalPages: number
}

/**
 * TableContent
 * @param columns
 * @param handleSort
 * @param visibleData
 * @param sortColumn
 * @param sortOrder
 * @param leftFixedColumns
 * @param rightFixedColumns
 * @param totalPages
 * @constructor
 */
function TableContent({columns, handleSort, visibleData, sortColumn, sortOrder, leftFixedColumns, rightFixedColumns, totalPages}: HandleTableProps) {

    const tableRef = useRef<HTMLTableElement>(null);

    const arrowsTemplate = (accessor:string, order: "asc" | "desc") => {
        return <span className="arrows" onClick={() => handleSort(accessor, order)} style={{color: accessor === sortColumn ? sortOrder === order ? 'black' : 'grey' : 'grey'}}>
            {order === 'asc' ? '↑' : '↓'}
        </span>;
    }

    useEffect(() => {
        const table = tableRef.current;
        const headerRow = table!.querySelector('thead tr');
        const rows = table!.querySelectorAll('tbody tr');
        const headerThWidth= table!.querySelector('thead tr th')!.clientWidth;
        if (headerRow && rows.length > 0) {
            for (let i = 0; i < columns.length; i++) {
                const th = headerRow.children[i] as HTMLElement;
                th.classList.remove('left', 'right', 'zIndexZh');
                th.style.left = '';
                th.style.right = '';
                const offsetTh = i < 1 || i === columns.length - 1 ? 0 : 2;
                if (leftFixedColumns && i < leftFixedColumns) {
                    th.classList.add('left', 'zIndexZh');
                    th.style.left =  headerThWidth * i + offsetTh + 'px';
                }
                if(rightFixedColumns && (columns.length - i) <= rightFixedColumns) {
                    th.classList.add('right', 'zIndexZh');
                    th.style.right =  (columns.length - i - 1) * headerThWidth + offsetTh + 'px';
                }
                for (let j = 0; j < rows.length; j++) {
                    const td = rows[j].children[i] as HTMLElement;
                    const offsetTd = i < 1 || i === columns.length - 1 ? 0 : 2;
                    td.classList.remove('left', 'right');
                    td.style.left = '';
                    td.style.right = '';
                    if (leftFixedColumns && i < leftFixedColumns) {
                        td.classList.add('left');
                        td.style.left =  headerThWidth * i + offsetTd + 'px';
                    }
                    if(rightFixedColumns && (columns.length - i) <= rightFixedColumns) {
                        td.classList.add('right');
                        td.style.right =  (columns.length - i - 1) * headerThWidth + offsetTd + 'px';
                    }
                }
            }
        }
    }, [columns.length, leftFixedColumns, rightFixedColumns, totalPages]);

    return (
        <table ref={tableRef}>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column.accessor}>
                        {column.header}
                        {arrowsTemplate(column.accessor, 'asc')}
                        {arrowsTemplate(column.accessor, 'desc')}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {visibleData.map((row, i) => (
                <tr key={i}>
                    {columns.map((column) => (
                        <td key={column.accessor}>{row[column.accessor]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function Table({columns, data, leftFixedColumns = 0, rightFixedColumns = 0, pageSize = 10}: Props) {
    const [sortedData, setSortedData] = useState(data);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortColumn, setSortColumn] = useState(columns[0].accessor);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);

    const handleSort = (column: string, newOrder: "asc" | "desc") => {
        setSortOrder(newOrder);
        setSortColumn(column);
        const sorted = data.slice().sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            if (aVal < bVal) {
                return newOrder === "asc" ? -1 : 1;
            }
            if (aVal > bVal) {
                return newOrder === "asc" ? 1 : -1;
            }
            return 0;
        });
        setSortedData(sorted);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (value: number) => {
        if (value < 1) return;
        setRowsPerPage(value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleData = sortedData.slice(startIndex, endIndex);

    return (
        <>
            <div className="tableContainer">
                {<TableContent columns={columns} handleSort={handleSort} sortColumn={sortColumn} sortOrder={sortOrder} visibleData={visibleData} leftFixedColumns={leftFixedColumns} rightFixedColumns={rightFixedColumns} totalPages={totalPages}/>}
            </div>
            {<Pagination  currentPage={currentPage} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} rowsPerPage={rowsPerPage} totalPages={totalPages}/>}
        </>
    );
}

export default Table;