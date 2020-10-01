'use strict';
import generateHeader from './Modules/generateHeader.js';
import generateFooter from './Modules/generateFooter.js';
import openMenu from './Modules/openMenu.js';

const coverContainer = document.querySelector('.cover-container');

generateHeader(coverContainer);
generateFooter(coverContainer);
openMenu();