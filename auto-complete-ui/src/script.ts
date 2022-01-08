import "../style/reset.css";
import "../style/style.css";
import cities from "../data/cities.json";
// eslint-disable-next-line
// @ts-ignore
import { createAutoComplete } from '../../auto-complete/index.js'
import ResultController from '../src/controller/ResultListController'

function render(): void {
  const search = createAutoComplete(cities)
  const root: Element = document.body
  const searchItemsWrapper: Element = document.createElement('div')
  const input = document.createElement('input')

  root.classList.add('body')
  searchItemsWrapper.classList.add('result-wrapper')
  input.classList.add('input')

  root.appendChild(input)
  root.appendChild(searchItemsWrapper)

  input.addEventListener('input', () => {
    searchItemsWrapper.replaceChildren()
    const ResultList = new ResultController(search(input.value), searchItemsWrapper)
    ResultList.renderList()
    ResultList.setObserver()
  })
}

export default render;
