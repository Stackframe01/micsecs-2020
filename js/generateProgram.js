const generateProgram = async () => {
    fetch('./program.json')
        .then(res => res.json())
        .then(program => {
                let language = {
                    en: 'English only',
                    ru: 'Russian only',
                    "en+ru": 'English with translation to Russian',
                    "ru+en": 'Russian with translation to English'
                }
                let time = {
                    long: "10 min - speech, 5 min - questions",
                    short: "5 min - speech, 5 min - questions",
                }
                let buttons = program.map(day => day.day).map((day, index) => `<a data-toggle="list" role="tab" href="#day${day.replace(/\./g, "")}" class="list-group-item list-group-item-secondary">Day ${index + 1} (${day})</a>`).join("")
                let headHTML = `<div class="list-group list-group-horizontal-md justify-content-center" role="tablist">
                                    <a id="timetableToggler" data-toggle="list" role="tab" href="#timetable" class="list-group-item list-group-item-secondary active">Schedule</a>
                                    ${buttons}
                                </div>
                                <div class="mt-2 text-center"><strong>Online conference - Preliminary version</strong></div>
                                <div class="mt-2 small text-center">All times specified for the Moscow timezone (UTC+3)</div>
                                `

                let tmp = program.map(day => {
                    let newDay = Object.assign({}, day);
                    newDay.events.sort(sortingFn);
                    return newDay
                })
                let daysHTML = tmp.map(day => `
                <div id="day${day.day.replace(/\./g, "")}" class="tab-pane w-75" role="tabpanel">
                        ${day.events.map(event => {
                        if (event.type.toLowerCase() == 'section') {
                            return `
                                <hr/>
                                <h2>${event.title}</h2>
                                <h4 class="text-left">Time: ${event.time}</h4>
                                ${event.chairman ? `<h4 class="text-left">Chairman: ${event.chairman}</h4>` : ""}
                                ${event["vice-chairman"] ? `<h4 class="text-left">Vice-Chairman: ${event["vice-chairman"]}</h4>` : ""}
                                ${event.commentary ? `<div>${event.commentary}</div>` : ""}
                                ${event.link ? `<div><a class="btn btn-secondary" href="${event.link}">Zoom room</a></div>` : ""}
                                <ol>
                                    ${event.presentations.map(presentation => `
                                        <br/>
                                        <li>
                                            <div class="clearfix">
                                                <span >${presentation.theme}</span>
                                            </div>
                                            <div>
                                                <em>${presentation.authors}</em>
                                                <div class="float-right">
                                                    <span data-toggle="tooltip" data-placement="top" title="${language[presentation.lang]}" class="badge badge-info">${presentation.lang}</span>
                                                    <span data-toggle="tooltip" data-placement="top" title="${time[presentation.time]}" class="badge badge-info">${presentation.time}</span>
                                                </div>
                                            </div>
                                        </li>
                                    `).join("")}
                                </ol>
                        `
                        } else {
                            return `<hr/>
                            <div class="text-center">
                                <h3 class="text-center font-weight-bold">${event.time}</h3>
                                <h4 class="text-center">
                                    ${event.title}
                                    ${event.lang ? `<div  data-toggle="tooltip" data-placement="top" title="${event.lang ? language[event.lang] : ''}" class="badge badge-info text-center">${event.lang}</div>` : ""}
                                </h4>
                                <div class="d-xs-block d-md-flex align-items-center justify-content-center">
                                    <div class="text-center w-50">
                                        ${event.author ? `<h5 class="text-center">${event.author}</h5>` : ""}
                                        ${event.organization ? `<h5 class="text-center">${event.organization}</h5>` : ""}
                                        ${event.photo ? `<img src="img/${event.photo}" class="schedule-img my-2 img-fluid text-center" alt="Photo of ${event.author}"/>` : ""}
                                    </div>
                                    ${event.annotation ? `<div class="ml-md-5 w-50 text-left">${event.annotation}</div>` : ""}
                                </div>
                                ${event.link ? `<br/><div class=${event.type !== 'Section' ? "text-center" : ''}><a class="btn btn-secondary" href="${event.link}">Watch online</a></div>` : ""}
                                <br/>
                            </div>`
                        }
                    }).join("")}
                </div>
                `
                ).join("");

                function langLabel(o) {
                    if (!o.lang) return "";
                    return `<span class="float-right">`
                        + `<span data-toggle="tooltip" data-placement="bottom" title="${language[o.lang]}" class="badge badge-info">${o.lang}</span>`
                        + `</span>`
                }

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
                let tableDailyFragmentHTML = tmp1.map(day => `
                    <tr><td class="d-table-cell d-sm-none text-center font-weight-bold" colspan="3">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td></tr>
                    ${day.map((events, index, array) => {
                    if (array.indexOf(events) == 0) {
                        if (events.length == 1) {
                            if (events[0].type.toLowerCase() == "section") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? ` ${events[0].time}`: ""} <br/> ${events[0].chairman ? `Chairman: ${events[0].chairman}` : ''}" class="text-center" colspan="2">${events[0].title}${ langLabel(events[0]) }</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                    <td class="text-center font-weight-bold">${events[0].title} ${langLabel(events[0])}</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? events[0].time : ''}" class="text-center"><div class="font-weight-bold">${events[0].title}</div>${events[0].author} (${events[0].organization}) ${ langLabel(events[0]) }</td>
                                </tr>`
                            }
                        } else {
                            let time = `<td class="d-none d-sm-table-cell">${events[0].time}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event, index,array) => {
                                console.log(event, index);
                                if (index == 0) {
                                    return accumulator += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${event.time ? event.time : ''} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center"><div class="font-weight-bold">${event.title}</div> ${event.author ? event.author : ""}${ langLabel(event) } </div>`
                                } else {
                                    return accumulator += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${event.time ? event.time : ''} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center border-left ${index == array.length-1 ? 'pr-0' : ""}"><div class="font-weight-bold">${event.title}</div> ${event.author ? event.author : ""} ${ langLabel(event) }</div>`
                                }
                            }, ``)}
                            </div></td>`
                            return `
                            <tr>
                                <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
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
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                                      <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? `${events[0].time}`: ""} <br/> ${events[0].chairman ? `Chairman: ${events[0].chairman}` : ''}" class="text-center" colspan="2">${events[0].title} ${ langLabel(events[0]) }</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                    <td class="text-center font-weight-bold">${events[0].title} ${ langLabel(events[0]) }</td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? `${events[0].time}`: ""}"  class="text-center"><div class="font-weight-bold">${events[0].title}</div>${events[0].author} (${events[0].organization}) ${ langLabel(events[0]) } </td>
                                </tr>`
                            }
                        } else {
                            let time = `<td class="d-none d-sm-table-cell">${events[0].time}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event, index, array) => {
                                if (index == 0) {
                                    var buf = "";
                                    buf += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${ event.type != "Event" ? (event.time ? event.time : "") : ""} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center clearfix">`
                                         + `<span class="font-weight-bold">${event.title}</span>`
                                         + `${event.author ? `<br/>${event.author}` : ""}`
                                         + `${ langLabel(event) }`
                                         + `</div>`
                                    return accumulator += buf;
                                } else {
                                    var buf = "";
                                    buf += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${ event.type != "Event" ? (event.time ? event.time : "") : ""}  <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center border-left clearfix ${index == array.length-1 ? "pr-0" : ""}">`
                                         + `<span class="font-weight-bold">${event.title}</span>`
                                         + `${event.author ? `<br/>${event.author}` : ""}`
                                         + `${ langLabel(event) }`
                                         + `</div>`
                                    return accumulator += buf;
                                }
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
                let timetableHTML = `<br/><div><table class="table table-bordered">
                    <tr>
                        <th class="d-none d-sm-table-cell">Date</th>
                        <th class="d-none d-sm-table-cell">Time</th>
                        <th class="text-center">Activity</th>
                    </tr>
                    ${tableDailyFragmentHTML}
                </table></div>`;


                let bodyHTML = `<div class="tab-content d-flex justify-content-center">
                                    <div id="timetable" class="tab-pane active" role="tabpanel">
                                        ${timetableHTML}
                                    </div>
                                   
                                    ${daysHTML}
                                </div>`
                let fullHTML = headHTML + bodyHTML
                return document.querySelector('#data').insertAdjacentHTML('afterbegin', fullHTML);
            }
        ).then(() => {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip({container: document.body});
        });

    })
};

generateProgram()

let sortingFn = (a, b) => a.time.split('-')[0] > b.time.split('-')[0] ? 1 : -1