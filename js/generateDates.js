const generateDates = () => {
    fetch('./dates.json')
        .then(res=>res.json())
        .then(dates=>{
            let datesList = dates.map(item=>`<li><strong>${item.title}:</strong> ${item.date}</li>`)
            let html = `
                <ul class="list-unstyled">
                    ${datesList.join('')}
                </ul>
                <p> 
                    <strong>All deadlines are for the Moscow time zone, 23:59.</strong>
                </p>

            `
            document.querySelector('.dates').insertAdjacentHTML('afterbegin', html);
        })
};

generateDates();