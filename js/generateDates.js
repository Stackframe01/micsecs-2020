const generateDates = () => {
    fetch('./dates.json')
        .then(res=>res.json())
        .then(dates=>{
            let datesList = dates.map(item=>`<li><strong>${item.title}:</strong> ${item.date}</li>`)
            let html = `
                <p class="mb-1"> 
                    <strong>All deadlines are for the Moscow time zone, 23:59.</strong>
                </p>
                <ul class="list-unstyled">
                    ${datesList.join('')}
                </ul>
            `
            document.querySelector('.dates').insertAdjacentHTML('afterbegin', html);
        })
};

generateDates();