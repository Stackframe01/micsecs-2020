const generateHeader = (block) => {
    const pathname = location.pathname.slice(1);

    const header = `
        <header class="masthead mb-auto">
            <div class="inner">
                <div class="d-block d-sm-none masthead-brand">
                    <img class="img-fluid" src="./img/face_logo_new2.png" />
                </div>
                <h1 class="d-none d-sm-block masthead-brand">MICSECS</h1>
                
                <div class="btn-menu">
                    <div class="btn-burger"></div>
                </div>
                <nav class="nav nav-masthead justify-content-center">
                    <a class="nav-link" href="index.html">Home</a>
                    <a class="nav-link" href="call.html">Call for Papers</a>
                    <a class="nav-link" href="publications.html">Publications</a>
                    <a class="nav-link" href="organization.html">Organization</a>
                    <a class="nav-link" href="contacts.html">Contacts</a>
                </nav>

                <nav class="nav flex-column mobail-nav py-2">
                    <a class="nav-link" href="index.html">Home</a>
                    <a class="nav-link" href="call.html">Call for Papers</a>
                    <a class="nav-link" href="publications.html">Publications</a>
                    <a class="nav-link" href="organization.html">Organization</a>
                    <a class="nav-link" href="contacts.html">Contacts</a>
                </nav>
            </div>
        </header>
    `;
    block.insertAdjacentHTML('afterbegin', header);

    const navLink = document.querySelectorAll('.nav-link');

    navLink.forEach(item => {
        if (item.href.includes(pathname)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};

export default generateHeader;