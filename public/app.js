const toCurresy = (price) => {
    return new Intl.NumberFormat('en-EN', {
        currency: 'usd',
        style: 'currency'
    }).format(price)
}

const toDate = date =>{
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(elem => {
    elem.textContent = toCurresy(elem.textContent)
})
document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card');

if ($card) {
    $card.addEventListener('click', event => {
        // console.log(event.target.classList.contains('js-remove'));
        if (event.target.classList.contains('js-remove')) {
            // console.log(event.target.dataset);


            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf


            fetch('/card/remove/' + id, {
                    method: 'delete',
                    headers: {
                        "X-CSRF-TOKEN": csrf
                    }
                }).then(data => data.json())
                .then(data => {
                    if (data.drugs.length) {
                        const card = data.drugs.map(c => {
                            return `
                            <tr>
                            <th>${c.sort}</th>
                            <th>${c.model}</th>
                            <th>${c.country}</th>
                            <th>${c.amount}</th>
                            <th>${c.count}</th>
                            <th>
                              <button
                                type="submit"
                                class="btn btn-small js-remove"
                                data-id="${c.id}"
                              >Удалить</button>
                            </th>
                          </tr>
                        `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = card
                        $card.querySelector('.price').textContent = toCurresy(data.price)
                    } else {
                        $card.innerHTML = "<p>Card is empty</p>"
                    }
                })
        }
    })
}


M.Tabs.init(document.querySelectorAll(".tabs"))











