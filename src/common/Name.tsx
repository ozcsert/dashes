export const NameInput: React.FC = ({ userName, setUserName }) => {
  return (
    <input
      placeholder="Pick a name"
      onChange={(e) => setUserName(e.target.value)}
      value={userName}
    />
  )
}
