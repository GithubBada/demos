export interface Item {
    id: number;
    student: string;
    teacher: string;
    classRoom: string;
    content: string
    phone: string;
    description: string;
}

export const tableColumns = [
    {
        header: "ID",
        accessor: "id",
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Teacher",
        accessor: "teacher",
    },
    {
        header: "Classroom",
        accessor: "classRoom",
    },
    {
        header: "Content",
        accessor: "content",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "Description",
        accessor: "description",
    },
];

/**
 * generate mock data
 * @param numItems
 */
export function generateMockData(numItems: number): Item[] {
    const data: Item[] = [];
    for (let i = 0; i < numItems; i++) {
        const item: Item = {
            id: i + 1,
            student: `Student ${addLeadingZero(i + 1)}`,
            teacher: `Teacher ${addLeadingZero(i + 1)}`,
            classRoom: `Classroom ${addLeadingZero(i + 1)}`,
            content: `Content ${addLeadingZero(i + 1)}`,
            phone: generateRandomPhoneNumber(),
            description: `online class for ${addLeadingZero(i + 1)}`,
        };
        data.push(item);
    }
    return data;
}

/**
 * Get phone number
 */
function generateRandomPhoneNumber(): string {
    const prefixList = ['13','15','16','17','18','19'];
    const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
    const middle = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return prefix + middle;
}

/**
 * Complementary numbers
 * @param num
 */
function addLeadingZero(num: number): string {
    return num.toString().padStart(2, '0');
}


