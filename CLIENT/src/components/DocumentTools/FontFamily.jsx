import { fontFamily } from "../../utilities/sheet";

export default function FontFamily({ formatDoc }) {
  return (
    <select
      onChange={(e) => formatDoc("fontName", e.target.value)}
      className="appearance-none row-start-1 col-start-1 bg-slate-50 px-1 focus:ring-1 focus:outline-none ring-blue-500"
    >
      {fontFamily.map((font, index) => (
        <option key={index} value={font} className="bg-white appearance-none" style={{fontFamily: font}}>
          {font}
        </option>
      ))}
    </select>
  );
}
