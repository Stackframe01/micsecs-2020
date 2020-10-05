const generateFooter = block => {
    const footer = `
        <footer class="mt-2 text-center footer">
            <div class="sponsors">
                <img class="mx-auto d-block" src="./img/itmo_logo_horiz_white_en.png"/>
            </div>
            <div>
                <p>©  MICSECS 2020 - The Majorov International Conference on Software Engineering and Computer Systems</p>
                <p>Conference date: December 10-11, Online &amp; Saint Petersburg, Russia</p>
            </div>
        </footer>
    `;

    block.insertAdjacentHTML('beforeend', footer);
};

export default generateFooter;