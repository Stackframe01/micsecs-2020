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

<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(68073283, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/68073283" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->

        </footer>
    `;

    block.insertAdjacentHTML('beforeend', footer);
};

export default generateFooter;