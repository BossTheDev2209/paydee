import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div> ไม่พบข้อมูล </div>
  }

  return (
    <div>
      <h1>ผลลัพธ์</h1>
      <p>{data.salary}</p>
      <p>{data.salary}</p>
    </div>
  )
}