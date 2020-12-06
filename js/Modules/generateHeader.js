const generateHeader = (block) => {
    const pathname = location.pathname.slice(1).split('/')[1];
    const header = `
    <div class="header w-100 d-flex flex-column align-items-center">
        <div class="brand d-flex flex-column align-items-center text-center mt-2">
            <a href="./index.html"><img class="img-fluid" src="./img/face_logo_new.png"/></a>
            <h1>MICSECS 2020</h1>
            <div>The Majorov International Conference on Software Engineering and Computer Systems</div>
        </div>
        <nav class="navbar navbar-expand-lg text-center">
            <button class="navbar-toggler mx-auto" type="button" data-toggle="collapse" data-target="#navbarToggler"
                    aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./index.html">Main</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./call.html">Call for Papers</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./registration.html">Registration</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./program.html">Program</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./publications.html">Publications</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./organization.html">Organization</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link menu-item" href="./contacts.html">Contacts</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    `;

    block.insertAdjacentHTML('afterbegin', header);

    const navLink = document.querySelectorAll('.nav-link');

    navLink.forEach(item => {
        if (item.href.includes(pathname)) {
            item.parentElement.classList.add('active');
        } else {
            item.parentElement.classList.remove('active');
        }
    });

};

export default generateHeader;
