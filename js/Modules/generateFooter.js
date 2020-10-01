const generateFooter = block => {
    const footer = `
        <footer class="mastfoot mt-auto">
            <div class="inner">
                <p>©  MICSECS 2020 - The Majorov International Conference on Software Engineering and Computer Systems</p>
                <p>Date and place will be announced soon</p>
            </div>
        </footer>
    `;

    block.insertAdjacentHTML('beforeend', footer);
};

export default generateFooter;