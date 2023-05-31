import React from 'react'

const GameStatus = ({ didWin, moneyEarned, lifes, time }) => {
  return (
    <div className='container border'>
      <p scope="col" className='text-secondary'> <strong>
                {new Date(Number(time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong></p>
      <table class="table">
        <tbody>
          <tr>
            <th scope="row">Result</th>
            <td>{didWin?"Won":"Loose"}</td>
           
          </tr>
          <tr>
            <th scope="row">Lifes Left</th>
            <td>{lifes}</td>
           
          </tr>
          <tr>
            <th scope="row">Money Earned</th>
           
            <td>{moneyEarned} eth</td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

export default GameStatus
