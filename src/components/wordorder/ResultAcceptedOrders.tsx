import type { StatementCard } from '../../types/statement'
import { getAcceptedOrders } from '../../utils/statements'
import { StatementLine } from './StatementLine'

function ordersMatch(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i])
}

type ResultAcceptedOrdersProps = {
  card: StatementCard
  userOrder: string[]
}

export function ResultAcceptedOrders({ card, userOrder }: ResultAcceptedOrdersProps) {
  const orders = getAcceptedOrders(card)

  return (
    <div className="result-accepted-orders">
      <p className="result-accepted-orders__heading">Accepted word orders</p>
      <ul className="result-accepted-orders__list">
        {orders.map((order, i) => {
          const isUserAnswer = ordersMatch(order, userOrder)
          const label =
            i === 0
              ? isUserAnswer
                ? 'Primary (your answer)'
                : 'Primary'
              : isUserAnswer
                ? `Also possible (your answer)`
                : 'Also possible'

          return (
            <li key={i} className="result-accepted-orders__item">
              <span className="result-accepted-orders__label">{label}</span>
              <StatementLine card={card} order={order} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
