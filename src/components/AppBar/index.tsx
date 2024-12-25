import logo from "@/public/Logo.svg"
import "./styles.scss"

type Props = {}

export const AppBar = (props: Props) => {
  return (
    <div className="appBar">
      <div className="appBar__logo-wrapper">
        <img src={logo} alt="logo" />
      </div>
    </div>
  )
}
