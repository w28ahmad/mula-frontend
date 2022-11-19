export default function PlayersTable(props) {

    return (
        <table className='table table-dark table-hover'>
            <thead>
                <tr>
                    <th scope='col'>Players</th>
                </tr>
            </thead>
            <tbody>
                {props.players.map(player => 
                    <tr key={player.id}>
                        <td style={{"padding":" 20px 80px"}}>{ player.name }</td>
                    </tr>
                )}                    
            </tbody>
            <tfoot/>
        </table>
    );
}