// Import Plugins
import $ from 'jquery'

// Import Variables
import __ from '../variables/variables'

export function initViews()
{

    
    if (!__.podcastData[0].timecode == 0 && __.appInit == false)
    {
        // Set Default Cover Image Here
        __.appInit = true
        __.coverImage.css('background-image', 'url(' + __.podcastCategoryImage + ')');
        __.theTitle.text(__.podcastDataCategory.Podcastmp3.categories_list_podcasts_list_title)
        __.blurElement.css('background-image', 'url(' + __.podcastCategoryImage + ')');

    }
    else
    {
        if (__.appInit == false){
            __.coverImage.css('background-image', 'url(' + __.podcastData[0].catimg + ')');
            __.theTitle.text(__.podcastData[0].title)
        }
    }

    __.theMainTitle.text(__.podcastDataCategory.Category.cat_name)
    __.theDate.text(__.podcastDataCategory.Podcastmp3.categories_list_podcasts_list_date)

    if (typeof window.orientation !== 'undefined')
    {
        let timetoSeconds = (str) =>
        {
            let p = str.split(':'),
                s = 0,
                m = 1;

            while (p.length > 0)
            {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }

            return s;
        }

        __.duration = timetoSeconds(__.podcastDataCategory.Podcastmp3.duration)
    }
    else
    {
        __.duration = __.audioObject.duration
    }   

    __.currentTime = __.audioObject.currentTime
    __.timeDifference = __.timeline.width() / __.duration


    // Refactor This
    function secondsToHms(d)
    {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        return m + ':' + s
    }


    $('#totalDuration').text(secondsToHms(__.duration))
}
