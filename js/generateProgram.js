const generateProgram = async () => {
    fetch('./program.json')
        .then(res => res.json())
        .then(program => {
                let buttons = program.map(day => day.day).map((day, index) => `<a data-toggle="list" role="tab" href="#day${day.replace(/\./g, "")}" class="list-group-item list-group-item-secondary">Day ${index + 1} (${day})</a>`).join("")
                let headHTML = `<div class="list-group list-group-horizontal-md justify-content-center" role="tablist">
                                    <a id="timetableToggler" data-toggle="list" role="tab" href="#timetable" class="list-group-item list-group-item-secondary">Schedule</a>
                                    ${buttons}
                                </div>
                                <div class="mt-2 small text-center">All times specified for the Moscow timezone (UTC+3)</div>
                                `

                let tmp = program.map(day => {
                    let newDay = Object.assign({}, day);
                    newDay.events.sort(sortingFn);
                    return newDay
                })
                let daysHTML = tmp.map(day => `
                <div id="day${day.day.replace(/\./g, "")}" class="tab-pane" role="tabpanel">
                        ${day.events.map(event => {
                        if (event.type.toLowerCase() == 'section') {
                            return `
                                <hr/>
                                <h2>${event.title}</h2>
                                <h4 class="text-left">Time: ${event.time}</h4>
                                <h4 class="text-left">Chairman: ${event.chairman}</h4>
                                ${event["vice-chairman"] ? `<h4 class="text-left">Vice-Chairman: ${event["vice-chairman"]}</h4>` : ""}
                                ${event.commentary?`<div>${event.commentary}</div>`:""}
                                <div><a class="btn btn-secondary" href="${event.link}">Zoom room</a></div>
                                <ol>
                                    ${event.presentations.map(presentation => `
                                        <hr><li><b>${presentation.time}</b> - ${presentation.theme} <br/><em>${presentation.authors}</em></li>
                                    `).join("")}
                                </ol>
                        `
                        } else {
                            return `<hr/>
                            <div>
                                <h3 class="text-center font-weight-bold">${event.time}</h3>
                                <h4  class="text-center">${event.title}</h4>
                                ${event.author ? `<br/><h5>${event.author}</h5>` : ""}
                                ${event.organization ? `<h5>${event.organization}</h5>` : ""}
                                ${event.annotation ? `<br/><div>${event.annotation}</div>` : ""}
                                ${event.photo ? `<img src="img/${event.photo}" class="schedule-img my-2 img-fluid" alt="Photo of ${event.author}"/>` : ""}
                                ${event.link ? `<br/><div class=${event.type == 'Event' ? "text-center" : ''}><a class="btn btn-secondary" href="${event.link}">Watch online</a></div>` : ""}
                                <br/>
                            </div>`
                        }
                    }).join("")}
                </div>
                `
                ).join("");

                let tmp1 = program.map(day => {
                    let tmpArrray = [...day.events]
                    tmpArrray.sort(sortingFn);
                    for (let eventIndex in tmpArrray) {
                        let newEvent = Object.assign({}, day.events[eventIndex]);
                        newEvent.date = day.day;
                        let newIndex = 0;
                        for (let i = 0; i <= tmpArrray.length; i++) {
                            if (Array.isArray(tmpArrray[i])) {
                                newIndex += 1;
                            }
                        }
                        if (eventIndex != 0 && tmpArrray[eventIndex].time.split('-')[0] == tmpArrray[newIndex - 1][0].time.split('-')[0]) {
                            tmpArrray[newIndex - 1] = [...tmpArrray[newIndex - 1], newEvent];
                            delete tmpArrray[eventIndex];
                        } else {
                            delete tmpArrray[eventIndex];
                            tmpArrray[newIndex] = [newEvent]
                        }
                    }
                    return tmpArrray.filter(el => el != null)
                })
                console.log(tmp1);
                let tableDailyFragmentHTML = tmp1.map(day => `
                    <tr><td class="d-table-cell d-sm-none text-center font-weight-bold" colspan="3">${day[0][0].date}</td></tr>
                    ${day.map((events, index, array) => {
                    if (array.indexOf(events) == 0) {
                        if (events.length == 1) {
                            if (events[0].type.toLowerCase() == "section") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${events[0].date}</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center" colspan="2">${events[0].title}</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${events[0].date}</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center">${events[0].title}</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${events[0].date}</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center"><b>${events[0].author}:</b> ${events[0].title}</td>
                                </tr>`
                            }
                        } else {
                            let time = `<td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event) => {
                                return accumulator += `<div data-toggle="tooltip" data-placement="top" title="${event.time}" class="col-xs-12 col-md-6 col-lg text-center border-right border-left">${event.title}</div>`
                            }, ``)}
                            </div></td>`
                            return `
                            <tr>
                                <td class="d-none d-sm-table-cell" rowspan="${day.length}">${events[0].date}</td>
                                ${time}
                                ${string}
                            </tr>
                        `
                        }
                    } else {
                        if (events.length == 1) {
                            if (events[0].type.toLowerCase() == "section") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center" colspan="2">${events[0].title}</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center">${events[0].title}</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>
                                    <td data-toggle="tooltip" data-placement="top" title="${events[0].time}" class="text-center"><b>${events[0].author}:</b> ${events[0].title}</td>
                                </tr>`
                            }
                        } else {
                            let time = `<td class="d-none d-sm-table-cell">${events[0].time.split('-')[0]}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event) => {
                                return accumulator += `<div data-toggle="tooltip" data-placement="top" title="${event.time}" class="col-xs-12 col-md-6 col-lg text-center border-right border-left">${event.title}</div>`
                            }, ``)}
                            </div></td>`
                            return `
                            <tr>
                                ${time}
                                ${string}
                            </tr>
                        `
                        }
                    }
                }).join("")}
                `).join("")
                let timetableHTML = `<hr/><div><table class="table table-bordered">
                    <tr>
                        <th class="d-none d-sm-table-cell">Date</th>
                        <th class="d-none d-sm-table-cell">Time</th>
                        <th class="text-center">Activity</th>
                    </tr>
                    ${tableDailyFragmentHTML}
                </table></div>`;

                let mainHTML = program.map(day => `
                    <hr/>
                    <h1 class="text-center">${day.day}</h1>
                    <div>
                        ${day.events.filter(event => event.type !== 'Section').map(event => {
                    return `<hr/>
                            <div>
                                <h3 class="text-center font-weight-bold">${event.time}</h3>
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
        $(document).ready(function () {
            console.log("initializing tooltips");
            $('[data-toggle="tooltip"]').tooltip({container: document.body});
        });

    })
};

generateProgram()

let sortingFn = (a, b) => a.time.split('-')[0] > b.time.split('-')[0] ? 1 : -1