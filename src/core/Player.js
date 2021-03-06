// Import Plugins
import $ from 'jquery'
import { secondsToHms, putLocalStorage, getLocalStorage } from '../core/Helpers'
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer.cjs.js'

class Player
{
    constructor(options)
    {
        this.__options = options
    }

    // PROTOTYPES
    
    createTimeline()
    {
        // First set Default Volume on Audio & Slider 
        // Check to see if the volume exists in LocalStorage

        if (typeof window.orientation !== 'undefined') {

        } else {
            if (getLocalStorage() == null)
            {

                putLocalStorage(
                {
                    defaultVolume: this.__options.defaultVolume
                })

                this.__options.audioObject.volume = this.__options.defaultVolume
                this.__options.volumeSlider.val(this.__options.defaultVolume)
            }
            else
            {
                getLocalStorage().defaultVolume = this.__options.defaultVolume
                this.__options.audioObject.volume = this.__options.defaultVolume
                this.__options.volumeSlider.val(getLocalStorage().defaultVolume)
            }
        } 
        


        // Start Timeline Creation
        if (!this.__options.firstInit)
        {
            for (let i = 0; i < this.__options.podcastData.length; i++)
            {

                /* beautify preserve:start */
                if ($(this.__options.$markers).length < this.__options.podcastData.length)
                {

                    this.__options.timeline.append(
                        '<span class="markers" data-timecode="'
                        + this.__options.podcastData[i].timecode
                        + '" style="left:'
                        + (this.__options.podcastData[i].timecode * this.__options.timeDifference)
                        + 'px"></span>');
                }
                else
                {

                }
                /* beautify preserve:end */
            }

            this.__options.markers = $('.markers')

            let wavesurfer = Object.create(WaveSurfer);

            wavesurfer.init(
            {
                container: '#wave-timeline',
                progressColor: 'rgba(0,0,0,0)',
                waveColor: '#000000',
                cursorColor: 'rgba(0,0,0,0)'
            });

            wavesurfer.load(this.__options.audioMp3File);

            this.__options.firstInit = true;
        }
    }

    EventListener()
    {

        // Volume Slider Event Listener
        this.__options.volumeSlider.on('input change', (e) =>
        {   
            if (typeof window.orientation !== 'undefined') { 

            } else {
                  this.__options.audioObject.volume = e.target.value
                  putLocalStorage(
                  {
                      defaultVolume: e.target.value
                  })
            }
          
        })

        this.__options.audioObject.addEventListener('timeupdate', () =>
        {
            // -------o Timeline width based on the current time of audio
            this.__options.timelineInner.css(
            {
                width: (this.__options.audioObject.currentTime) * this.__options.timeDifference + 'px'
            })

            // Buffered Width
            this.__options.buffered.css(
            {
                width: (this.__options.audioObject.buffered.end(0)) * this.__options.timeDifference + 'px'
            })

            // -------o Update the Current Time DOM Element


            // Refactor this, i don't like it
            $('#nowDuration').text(secondsToHms(this.__options.audioObject.currentTime))

            for (let i = $(this.__options.markers).length - 1; i >= 0; i--)
            {
                if (this.__options.audioObject.currentTime > this.__options.podcastData[i].timecode)
                {
                    if (!this.__options.podcastData[i].seen)
                    {
                        this.__options.coverImage.css(
                            'background-image', 'url('+ this.__options.podcastData[i].cover_url + ')');

                        this.__options.theTitle.text(this.__options.podcastData[i].title)
                        this.__options.blurElement.css('background-image', 'url(' + this.__options.podcastData[i].cover_url + ')');
                        this.__options.podcastData[i].seen = true
                    }

                    break
                }
            }
        }, false)

        this.__options.audioObject.addEventListener('ended', () =>
        {
            // Audio has Finished
            this.__options.estatActions.notifyPlayer('stop')
            this.__options.audioObject.currentTime = 0.1
            this.__options.coverImage.css(
                   'background-image', 'url(' + this.__options.podcastCategoryImage + ')');

            this.__options.blurElement.css('background-image', 'url(' + this.__options.podcastCategoryImage + ')');

            this.__options.theTitle.text(this.__options.podcastDataCategory.Podcastmp3.categories_list_podcasts_list_title)

            // Repeating Code Here
            this.__options.playButton.show();
            this.__options.pauseButton.hide();

        })
    }

    clickEvents()
    {
        this.__options.timeline.on('click', (e) =>
        {
            /**
             * Timeline Calculation
             * @type {[type]}
             *
             *  When a user clicks on the timeline, we need to make sure 
             *  it goes to the right spot, and updates the audio at that current time
             *
             *  Example Calculation
             *  duration : 148.8239 seconds
             *  timeline (clicked) offset : 120px
             *  timeline total width : 300px
             *
             *  148.8239 x ( 120 / ( 300 x 2 ) x 2)
             *  
             */

            // this.__options.loadingSpinner.show()
            // this.__options.pauseButton.hide();

            // this.__options.audioObject.addEventListener('canplay', () => {
            //      this.__options.loadingSpinner.hide()
            //      this.__options.pauseButton.show();
            // })
            if (typeof window.orientation !== 'undefined')
            {

                this.__options.audioObject.play()
                this.__options.playButton.trigger('click')
            }
            else
            {

            }

            for (let i = 0; i < this.__options.podcastData.length; i++)
            {
                this.__options.podcastData[i].seen = false;
            }

            let now = this.__options.duration * (e.offsetX / (this.__options.timeline.outerWidth() * 2)) * 2;

            playAt(now);


            for (let i = 0; i < this.__options.markers.length; i++)
            {
                if (now > this.__options.podcastData[i].timecode)
                {
                    this.__options.coverImage.css(
                        'background-image', 'url('+ this.__options.podcastData[i].cover_url+ ')');
   
                    this.__options.theTitle.text(this.__options.podcastData[i].title)
                }
                else if (now < this.__options.podcastData[0].timecode)
                {
                    this.__options.coverImage.css('background-image', 'url('+ this.__options.podcastCategoryImage + ')');
    

                    this.__options.blurElement.css('background-image', 'url(' + this.__options.podcastCategoryImage + ')');
                    this.__options.theTitle.text(this.__options.podcastDataCategory.Podcastmp3.categories_list_podcasts_list_title)
                }
            }
        })

        let playAt = (time) =>
        {
            this.__options.audioObject.currentTime = time;
        }

        // Set the Click Events Here
        this.__options.playButton.on('click', () =>
        {
            this.__options.audioObject.play()
                // ESTAT ACTIONS
            this.__options.estatActions.notifyPlayer('play')


            // Repeating Code Here
            this.__options.playButton.hide();
            this.__options.pauseButton.show();


        })

        this.__options.pauseButton.on('click', () =>
        {
            this.__options.audioObject.pause()
                // ESTAT ACTIONS
            this.__options.estatActions.notifyPlayer('pause')


            // Repeating Code Here
            this.__options.playButton.show();
            this.__options.pauseButton.hide();
            // controller()
        })

        // let controller = () => 
        // {

        //     // Check if music is playing
        //     this.__options.audioObject.addEventListener('playing', function(){
        //         console.log('audio is playingg')
        //     })

        // }

        // Mute Button
        // When we toggle this, get the last volume from localStorage

        // this.__options.volumeBtn.toggle(() => {
        //     if (this.__options.volumeBtn.hasClass('muted')){
        //         console.log('has class muted')
        //     } else {
        //         console.log('no class - muted')
        //         this.__options.audioObject.volume = 0
        //         this.__options.volumeSlider.val(0)
        //     }
        // })

        this.__options.volumeBtn.on('click', () =>
        {
            if (this.__options.volumeBtn.hasClass('muted'))
            {
                this.__options.volumeBtn.removeClass('muted')
                    // set normal value
                this.__options.audioObject.volume = getLocalStorage().defaultVolume
                this.__options.volumeSlider.val(getLocalStorage().defaultVolume)

            }
            else
            {
                this.__options.volumeBtn.addClass('muted')
                this.__options.audioObject.volume = 0
                this.__options.volumeSlider.val(0)
            }

        })
    }
}

export default Player
