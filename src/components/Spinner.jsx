import LoadingSpinner from '../assets/svg/Loading-Gif.gif'

export const Spinner = () => {
    return (
        <div className='loadingSpinnerContainer'>
          <div className='loadingSpinner'>
              <svg src = {LoadingSpinner} alt='loading'/>
          </div>
        </div>
      )
}