// QuickMode.jsx (แก้เฉพาะส่วน onSubmit)
// ... (imports เดิม)

export default function QuickMode({ calculate, loading }) {
  // ... (code เดิม)

  return (
    <div className="w-full mt-10">
      <CalculatorCard title="Quick Mode">
        <Formik
          // ... (initialValues เดิม)
          // ... (validationSchema เดิม)
          onSubmit={(values) => {
             // แก้ไขตรงนี้: ส่งค่ารายเดือนไปตรงๆ ไม่ต้องคูณ 12 
             // (เพราะใน taxQuick.js เราตั้งให้รับค่ารายเดือนแล้วคูณเอง)
            const normalizedValues = {
              ...values,
              salary: Number(values.salary), 
              expenses: Number(values.expenses)
            };
            calculate(normalizedValues, "quick");
          }}
        >
          {/* ... (Form JSX เดิมทั้งหมด ไม่ต้องแก้ UI) */}
        </Formik>
      </CalculatorCard>
    </div>
  );
}