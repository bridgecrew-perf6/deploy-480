import "../style/reset.css";
import "../style/style.css";
import cities from "../data/cities.json";
import { createAutoComplete } from '../../auto-complete/index.js'
import ResultController from '../src/controller/ResultListController'
import config from "../data/config";

function render(): void {
  const search = createAutoComplete(cities)
  const root: Element = document.body
  const searchItemsWrapper: Element = document.createElement('div')
  const input = document.createElement('input')
  const startSearchItem = document.createElement('div')

  root.classList.add('body')
  searchItemsWrapper.classList.add('result-wrapper')
  input.classList.add('input')
  startSearchItem.classList.add('welcome-message')
  startSearchItem.innerText = config.enterTextInTheSearchFields

  searchItemsWrapper.appendChild(startSearchItem)
  root.appendChild(input)
  root.appendChild(searchItemsWrapper)

  input.addEventListener('input', () => {
    searchItemsWrapper.replaceChildren()
    const _tempWrapper: Element = document.createElement('div')
    searchItemsWrapper.append(_tempWrapper)
    const resultArr = search(input.value)
    const ResultList = new ResultController(resultArr, _tempWrapper, resultArr.length, input.value !== '')
    ResultList.renderList(0)
    ResultList.setObserver()
  })
}

export default render;
