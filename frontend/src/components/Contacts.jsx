function Contacts ({ persons, onDelete }){
    return (
        <div>
        <ul style={{ padding: 0 }}>
          {persons.map(p => (
            <li key={p.id} style={{ listStyle: 'none' }}>
              <span style={{ fontWeight: 'bold' }}>{p.name} </span>
              {p.number}
              <button onClick={() => onDelete(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default Contacts