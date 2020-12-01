const generateProgram = () => {
    fetch('./program.json')
        .then(res => res.json())
        .then(program => {
                let buttons = program.full.map(day => day.day).map(day => `<a data-toggle="list" role="tab" href="#day${day.replace(/\./g,"")}" class="list-group-item list-group-item-secondary">Sections (${day})</a>`).join("")
                let headHTML = `<div class="list-group list-group-horizontal-md justify-content-center" role="tablist">
                                    <a data-toggle="list" role="tab" href="#general" class="list-group-item list-group-item-secondary">Main part</a>
                                    ${buttons}
                                </div>`
                let daysHTML = program.full.map(day => `
                <div id="day${day.day.replace(/\./g,"")}" class="tab-pane" role="tabpanel">
                        ${day.sections.map(section => `
                                <hr/>
                                <h2>${section.name}</h2>
                                <h4>Time: ${section.time}</h4>
                                <h4>Chairman: ${section.chairman}</h4>
                                <ul>
                                    ${section.presentations.map(presentation => `
                                        <li>${presentation.time} - ${presentation.theme} <i>${presentation.authors}</i> - <a href="${presentation.link}">Watch online</a></li>
                                    `).join("")}
                                </ul>
                        `).join("")}
                </div>
                `
                ).join("");

                let mainHTML = program.main.map(event=>`
                    <hr/>
                    <div> 
                        <h3 class="text-center font-weight-bold">${event.date}</h3>
                        <h3 class="text-center font-weight-bold">${event.time}</h3>
                        <h4  class="text-center">${event.title}</h4>
                        <br/>
                        <h4 class="font-weight-bold">${event.presenter ? event.presenter : ""}  </h4>
                        <h5>${event.organization ? event.organization : ""}</h5>
                        ${event.annotation ? `<br/><div>${event.annotation}</div>` : ""}
                        ${event.link ? `<div class="text-center"><a class="btn btn-secondary" href="${event.link}">Watch online</a></div>` : ""}
                        <br/>
                    </div>
                `).join("")
                let bodyHTML = `<div class="tab-content">
                                    <div id="general" class="tab-pane" role="tabpanel">
                                        ${mainHTML}
                                    </div>
                                    ${daysHTML}
                                </div>`
                let fullHTML = headHTML+bodyHTML
                document.querySelector('#data').insertAdjacentHTML('afterbegin', fullHTML);
            }
        )
};

generateProgram();