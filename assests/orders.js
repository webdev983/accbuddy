console.log('подключено')

let orders = [{ //will be replaced to real array of orders
    date: '15 may 2023',
    number: '№ 3478741',
    item: 'Gmail.com PVA',
    amount: '$13.00',
    status: 'Completed'
},
{
    date: '16 may 2023',
    number: '№ 3478742',
    item: 'Gmail.com PVA',
    amount: '$13.00',
    status: 'Completed'
},
{
    date: '17 may 2023',
    number: '№ 3478743',
    item: 'Gmail.com PVA',
    amount: '$13.00',
    status: 'Completed'
}]

const table = orders.map(order=> `<tr>
<td class="ab-order-history-main-item">${order.date}</td>
<td class="ab-order-history-main-item">${order.number}</td>
<td class="ab-order-history-main-item">${order.item}</td>
<td class="ab-order-history-main-item">${order.amount}</td>
<td class="ab-order-history-main-item"><span>${order.status}</span><button class="ab-view-details-btn">View details</button></td>
</tr>`)

tbody.insertAdjacentHTML('afterbegin', table);