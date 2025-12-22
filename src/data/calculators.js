import AI from "../images/Ai_icon.png";

export const popularCalculators = [
    {
        id: 1,
        path: "/salary-aftertax",
        title: "รายได้สุทธิหลังภาษี",
        details: "รู้เงินเดือนที่แท้จริงหลังหักภาษีและประกันสังคม",
        bgColor: "#67B8FF",
        isAi: true,
        aiIcon: AI,
        altName: "Salary After Tax",
        tags: ["พนักงานประจำ", "ละเอียด"],
        calculatorType: "AI"
    },
    {
        id: 2,
        path: "/saving-goal",
        title: "เป้าหมายการออม",
        details: "วางแผนเก็บเงินเพื่อเป้าหมายฝันที่เป็นจริง",
        bgColor: "#867CFF",
        isAi: false,
        aiIcon: AI,
        icon: "fa-solid fa-piggy-bank",
        altName: "Saving Goal",
        tags: ["มือใหม่", "ออมเงิน"],
        calculatorType: "Formula"
    },
    {
        id: 3,
        path: "/investment-info",
        title: "จำลองการลงทุน",
        details: "ดูแนวโน้มการเติบโตของเงินลงทุนในตลาดหุ้น",
        bgColor: "#FF8CA2",
        isAi: true,
        aiIcon: AI,
        altName: "Investment Info, SET Simulation",
        tags: ["นักลงทุน", "จำลองสถานการณ์"],
        calculatorType: "AI"
    },
    {
        id: 4,
        path: "/debt-management",
        title: "บริหารหนี้สิน",
        details: "หาทางออกและวิธีจัดการหนี้อย่างเป็นระบบ",
        bgColor: "#50df84",
        icon: "fa-solid fa-hand-holding-dollar",
        altName: "Debt Management",
        tags: ["ปลดหนี้", "วางแผน"],
        calculatorType: "Formula"
    },
    {
        id: 5,
        path: "/currency-converter",
        title: "แปลงสกุลเงิน",
        details: "เช็คเรทเงินแลกเปลี่ยนทั่วโลกแบบเรียลไทม์",
        bgColor: "#FFD166",
        icon: "fa-solid fa-money-bill-transfer",
        altName: "Currency Converter",
        tags: ["ท่องเที่ยว", "เรียลไทม์"],
        calculatorType: "Formula"
    },
    {
        id: 6,
        path: "/sleep-calculator",
        title: "คำนวณเวลานอน",
        details: "หาเวลานอน-ตื่นที่เหมาะกับคุณตาม Sleep Cycle",
        bgColor: "#A78BFA",
        icon: "fa-solid fa-moon",
        altName: "Sleep Calculator",
        tags: ["สุขภาพ", "ไลฟ์สไตล์"],
        calculatorType: "Formula"
    },
    {
        id: 7,
        path: "/sleep-debt",
        title: "คำนวณหนี้การนอน",
        details: "ติดตามและคำนวณหนี้การนอนของคุณ",
        bgColor: "#9333EA",
        icon: "fa-solid fa-moon",
        altName: "Sleep Debt Calculator",
        tags: ["สุขภาพ", "ไลฟ์สไตล์"],
        calculatorType: "Formula"
    }
];

// Helper to fill categories to at least 3 items
const fillCategory = (items) => {
    if (items.length === 0) return [];
    let result = [...items];
    while (result.length < 3) {
        result = [...result, ...items];
    }
    // Limit to 3 if only 1 item existed and we tripled it, or just ensure we have enough.
    // Actually the requirement is "if less than 3 just loop it". 
    // If we have 1, we need 3 (1, 1, 1). If 2, we need 4 or 3 (2, 1, 2?). 
    // Let's just make sure it has enough to look good (e.g. at least 4 for carousel or 3).
    // Carousel usually shows multiple. 
    return result.slice(0, Math.max(items.length, 3));
};

const formulaCalculators = popularCalculators.filter(c => !c.isAi);
const aiCalculators = popularCalculators.filter(c => c.isAi);

// Ensure unique IDs for looped items to avoid React key warnings if possible, 
// though for static data passing same object might be okay if key uses index.
// But better to clone and update ID? 
// The Carousel component uses `id` for key usually (item.id).
// Let's create a safe filler that generates unique IDs.
const fillCategorySafe = (items) => {
    if (items.length === 0) return [];
    let result = [...items];
    let sourceIndex = 0;
    while (result.length < 4) { // Carousel usually looks better with 4 items if scrolling
        const sourceItem = items[sourceIndex % items.length];
        result.push({
            ...sourceItem,
            id: `${sourceItem.id}-copy-${result.length}` // Unique ID
        });
        sourceIndex++;
    }
    return result;
};

export const category1 = fillCategorySafe(formulaCalculators);
export const category2 = fillCategorySafe(aiCalculators);
export const lifestyleCalculators = popularCalculators.filter(c =>
    c.tags?.includes("ไลฟ์สไตล์")
);

