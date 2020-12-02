const generateProgram = async () => {
    fetch('./program.json')
        .then(res => res.json())
        .then(program => {
                let buttons = program.map(day => day.day).map(day => `<a data-toggle="list" role="tab" href="#day${day.replace(/\./g, "")}" class="list-group-item list-group-item-secondary">Sections (${day})</a>`).join("")
                let headHTML = `<div class="list-group list-group-horizontal-md justify-content-center" role="tablist">
                                    <a id="timetableToggler" data-toggle="list" role="tab" href="#timetable" class="list-group-item list-group-item-secondary">Timetable</a>
                                    <a id="mainToggler" data-toggle="list" role="tab" href="#main" class="list-group-item list-group-item-secondary">Activities</a>
                                    ${buttons}
                                </div>`

                let daysHTML = program.map(day => `
                <div id="day${day.day.replace(/\./g, "")}" class="tab-pane" role="tabpanel">
                        ${day.events.map(event => {
                        if (event.type.toLowerCase() == 'section')
                            return `
                                <hr/>
                                <h2>${event.title}</h2>
                                <h4>Time: ${event.startTime}</h4>
                                <h4>Chairman: ${event.chairman}</h4>
                                <div><a href="${event.link}">Zoom room</a></div>
                                <ul>
                                    ${event.presentations.map(presentation => `
                                        <li>${presentation.startTime} - ${presentation.theme} <em>${presentation.authors}</em></li>
                                    `).join("")}
                                </ul>
                        `
                    }).join("")}
                </div>
                `
                ).join("");

                let tmp = program.map(day => {
                    day.events.sort((a, b) => a.startTime > b.startTime ? 1 : -1)
                    let tmpArrray = [...day.events]
                    for (let eventIndex in tmpArrray) {
                        let newEvent = Object.assign({}, day.events[eventIndex]);
                        newEvent.date = day.day;
                        let newIndex = 0;
                        for (let i = 0; i <= tmpArrray.length; i++) {
                            if (Array.isArray(tmpArrray[i])) {
                                newIndex += 1;
                            }
                        }
                        if (eventIndex != 0 && tmpArrray[eventIndex].startTime == tmpArrray[newIndex - 1][0].startTime) {
                            tmpArrray[newIndex - 1] = [...tmpArrray[newIndex - 1], newEvent];
                            delete tmpArrray[eventIndex];
                        } else {
                            delete tmpArrray[eventIndex];
                            tmpArrray[newIndex] = [newEvent]
                        }
                    }
                    return tmpArrray
                })
                let tableDailyFragmentHTML = tmp.map(day => `<tr>
                        <td class="text-center font-weight-bold" colspan="3">${day[0][0].date}</td>
                    </tr>
                    ${day.map(events => {
                    console.log(events);
                    if (events.length == 1) {
                        if (events[0].type.toLowerCase() == "section") {
                            return `
                                <tr>
                                    <td>${events[0].startTime}</td>
                                    <td class="text-center" colspan="2">${events[0].title}</td>
                                </tr>
                            `
                        } else if (events[0].type.toLowerCase() == "event") {
                            return `
                                <tr>
                                    <td>${events[0].startTime}</td>
                                    <td class="text-center">${events[0].title}</td>
                                </tr>
                            `
                        } else if (events[0].type.toLowerCase() == "speech") {
                            return `
                                <tr>
                                    <td>${events[0].startTime}</td>
                                    <td>${events[0].author}</td>
                                    <td>${events[0].title}</td>
                                </tr>`
                        }
                    } else {
                        let time = `<td>${events[0].startTime}</td>`
                        let string = `
                            <td class="row">
                                ${events.reduce((accumulator, event) => {
                            console.log(event.type.toLowerCase() == "speech")
                            if (event.type.toLowerCase == "speech") {
                                return accumulator += `<div data-toggle="tooltip" data-placement="top" title="${event.annotation}" class="col-xs-12 col-md-6 col-lg text-center">${event.title}</div>`
                            } else {
                                return accumulator += `<div class="col-xs-12 col-md-6 col-lg text-center">${event.title}</div>`
                            }
                        }, ``)}
                            </td>`
                        return `
                            <tr>
                                ${time}
                                ${string}
                            </tr>
                        `
                    }
                }).join("")}
                `).join("")
                let timetableHTML = `<div><table class="table">
                    <tr>
                        <th>Time</th>
                        <th class="text-center">Activity</th>
                    </tr>
                    ${tableDailyFragmentHTML}
                </table></div>`;

                let mainHTML = program.map(day => `
                    <hr/>
                    <h1 class="text-center">${day.day}</h1>
                    <div>
                        ${day.events.filter(event=>event.type!=='Section').map(event=>{
                            return `<hr/>
                            <div>
                                <h3 class="text-center font-weight-bold">${event.startTime}</h3>
                                <h4  class="text-center">${event.title}</h4>
                                ${event.author ? `<br/><h4 class="font-weight-bold">${event.author}</h4>` : ""}
                                <h5>${event.organization ? event.organization : ""}</h5>
                                ${event.annotation ? `<br/><div>${event.annotation}</div>` : ""}
                                ${event.link ? `<br/><div class="text-center"><a class="btn btn-secondary" href="${event.link}">Watch online</a></div>` : ""}
                                <br/>
                            </div>`
                    }).join("")}
                    </div>
                `).join("")

                let bodyHTML = `<div class="tab-content">
                                    <div id="timetable" class="tab-pane" role="tabpanel">
                                        ${timetableHTML}
                                    </div>
                                    <div id="main" class="tab-pane" role="tabpanel">
                                        ${mainHTML}
                                    </div>
                                   
                                    ${daysHTML}
                                </div>`
                let fullHTML = headHTML + bodyHTML
                return document.querySelector('#data').insertAdjacentHTML('afterbegin', fullHTML);
            }
        ).then(() => {
        document.getElementById('timetableToggler').addEventListener('click', enableTooltips)
    })
};

generateProgram()

let enableTooltips = () => {
    document.querySelector('[data-toggle="tooltip"]').tooltip()
}

