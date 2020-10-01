const generateHeader = (block) => {
    const pathname = location.pathname.slice(1);

    const header = `
        <header class="masthead mb-auto">
            <div class="inner">
                <h3 class="masthead-brand">MICSECS</h3>
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

                <nav class="mobail-nav">
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