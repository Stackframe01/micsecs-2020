const generateFooter = block => {
    const footer = `
        <footer class="w-100 mt-2 text-center footer">
            <div class="sponsors">
                <a href="//itmo.ru"><img class="mx-auto d-block img-fluid" src="./img/itmo_logo_horiz_white_en.png"/></a>
            </div>
            <div>
                <p>©  MICSECS 2020 - The Majorov International Conference on Software Engineering and Computer Systems</p>
                <p>Conference date: December 10-11, Online &amp; Saint Petersburg, Russia</p>
            </div>
        </footer>
        <noscript><div><img src="https://mc.yandex.ru/watch/68073283" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    `;

    block.insertAdjacentHTML('beforeend', footer);
};

export default generateFooter;