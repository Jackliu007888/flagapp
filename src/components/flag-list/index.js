import style from './index.module.styl'

export default {
  props: ['selectedFlagList'],
  render(h) {
    return (
      <ul>
        {
          this.selectedFlagList.map((item, index) => {

            const tenUnit = parseInt((index + 1)/ 10)
            const sigle = (index + 1) % 10
            return (
              <li key={index}>
                <div class={style['li-number-sigle']}>
                  <div class={style['number-bg']}></div> 
                  <div class={style['number-line']}></div> 
                  {
                    !!tenUnit && (<div class={[style['number'], style[`l${tenUnit}`]]}></div>)
                  }
                  <div class={[style['number'], style[`l${sigle}`]]}></div>
                </div>
                <div class={style['li-text']}>{item}</div>
              </li>
            )
          })
        }
      </ul>
    )
  }
}