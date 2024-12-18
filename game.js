import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
    name: 'game',
    schema: {
        status1: ecs.eid,  // 1 coin collected
        status2: ecs.eid,  // 2 coins collected
        status3: ecs.eid,  // 3 coins collected
    },

    stateMachine: ({ world, eid, schemaAttribute }) => {
        const {
            status1,
            status2,
            status3,
        } = schemaAttribute.get(eid)

        let startScreen = null
        let buttonStart = null
        let finalScreen = null
        let flexWrapper = null

        const divContainerStyle = {
            position: 'absolute',
            top: '15%',
            left: '0%',
            width: '100%',
            height: '70%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }

        const screenContainerStyle = {
            width: '70%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '1rem 2rem',
            borderRadius: '1rem',
            backgroundColor: '#10113A',
            color: '#FFFFFF',
            fontSize: '1.125rem',
            fontFamily: 'Helvetica, sans-serif',
        }

        const headerStyle = {
            fontWeight: '700',
            fontSize: '2rem',
            margin: '0',
            textAlign: 'center',
        }

        const buttonStartStyle = {
            position: 'relative',
            backgroundColor: '#EA5739',
            fontWeight: '700',
            zIndex: '100',
            fontSize: '1.75rem',
            justifySelf: 'end',
            marginTop: 'auto',
            alignSelf: 'center',
            padding: '0.5rem 3rem',
            borderRadius: '5rem',
            color: '#FFFFFF',
        }

        const endGame = ecs.defineTrigger()
        const startGame = ecs.defineTrigger()

        // Update Status
        const updateStatus = (collectedCoinsCount) => {
            switch (collectedCoinsCount) {
                case 0:
                    break
                case 1:
                    ecs.Ui.mutate(world, status1, (cursor) => {
                        cursor.opacity = 1
                    })
                    break
                case 2:
                    ecs.Ui.mutate(world, status1, (cursor) => {
                        cursor.opacity = 1
                    })
                    ecs.Ui.mutate(world, status2, (cursor) => {
                        cursor.opacity = 1
                    })
                    break
                case 3:
                    ecs.Ui.mutate(world, status1, (cursor) => {
                        cursor.opacity = 1
                    })
                    ecs.Ui.mutate(world, status2, (cursor) => {
                        cursor.opacity = 1
                    })
                    ecs.Ui.mutate(world, status3, (cursor) => {
                        cursor.opacity = 1
                    })
                    break
                default:
                    break
            }
        }

        const showStory = (coin, collectedCoinsCount) => {
            flexWrapper = document.createElement('div')
            Object.assign(flexWrapper.style, divContainerStyle)
            document.body.appendChild(flexWrapper)

            const storyScreen = document.createElement('div')

            // Assign the style to startScreen
            Object.assign(storyScreen.style, screenContainerStyle)
            flexWrapper.appendChild(storyScreen)

            // create header
            const h1 = document.createElement('h1')
            storyScreen.appendChild(h1)

            const headerStoryStyle = {
                fontWeight: '700',
                fontSize: '1.5rem',
            }
            Object.assign(h1.style, headerStoryStyle)

            // create paragrapgh
            const paragraph1 = document.createElement('p')
            storyScreen.appendChild(paragraph1)

            // create paragraph2
            const paragraph2 = document.createElement('p')
            storyScreen.appendChild(paragraph2)

            // create button
            const storyLeuk = document.createElement('button')
            storyLeuk.textContent = 'LEUK!'
            Object.assign(storyLeuk.style, buttonStartStyle)

            storyLeuk.addEventListener('click', () => {
                flexWrapper.parentNode.removeChild(flexWrapper)
                if (collectedCoinsCount >= 3) endGame.trigger()
            })
            storyScreen.appendChild(storyLeuk)

            // render story depending on the location:
            switch (coin) {
                case 'infopunkt':
                    h1.textContent = 'Het verhaal van de Mechaniekers ruimte:'
                    paragraph1.innerHTML = 'Bij de <b>Mechaniekersruimte</b> werk ik aan mijn <b>grootste projecten</b> – ik heb er zelfs een <b>tijdmachine gebouwd!</b> Vanavond treden er geweldige artiesten op, die ik uit de toekomst heb getoverd.'
                    paragraph2.innerHTML = 'Ga zeker eens kijken!'
                    break
                case 'ramp':
                    h1.textContent = 'Het verhaal van de brug:'
                    paragraph1.innerHTML = 'Wanneer ik een oppepper nodig heb, dans ik graag bij de brug terwijl ik naar de muziek van de <b>GRNDLGGRS</b> luister. Het is alsof de wereld even stilstaat en ik <b>helemaal mezelf</b> kan <b>zijn!</b>'
                    paragraph2.innerHTML = 'Waarom probeer jij het niet ook eens?'
                    break
                case 'octagon':
                    h1.textContent = 'Het verhaal van de Octagon: '
                    paragraph1.innerHTML = 'De vorm van de <b>octagon</b> is zo bijzonder! Helemaal <b>anders dan</b> de <b>andere</b> gebouwen, extra leuk dus! Vanavond kun je daar ook genieten van prachtige beeld- en geluidsinstallatie gemaakt door de leerlingen van de <b>kunstacademie.</b> '
                    paragraph2.innerHTML = 'Ga jij ook een kijkje nemen?'
                    break
                default:
                    break
            }
        }

        const handleGameStart = () => {
            startGame.trigger()
        }

        // Define game states
        ecs.defineState('onboarding')
            .onEnter(() => {
                // add eventlistener to the button
                const onxrloaded = () => {
                    // check if the game has started?
                    const collectedCoins = JSON.parse(localStorage.getItem('collectedCoins')) || []
                    const collectedCoinsCount = collectedCoins.length
                    updateStatus(collectedCoinsCount)
                    if (collectedCoinsCount > 0) {
                        const timer = setTimeout(() => {
                            startGame.trigger()
                            clearTimeout(timer)
                        }, 1000)
                    } else {


                        // create h1
                        const header = document.createElement('h1')
                        header.textContent = 'Hallo,'
                        // Assign the style to startScreen
                        Object.assign(header.style, headerStyle)
                        startScreen.appendChild(header)

                        // create p
                        const paragraph1 = document.createElement('p')
                        paragraph1.innerHTML = '<b>Welkom bij het Miefel AR-spel!</b></br>Ga op zoek naar de Miefel-munten door met je gsm rond te bewegen. Zie je er een? Klik erop om hem te verzamelen.'
                        startScreen.appendChild(paragraph1)

                        // create p
                        const paragraph2 = document.createElement('p')
                        paragraph2.innerHTML = 'Er zijn in totaal 3 munten verstopt. Succes en veel plezier met zoeken!'
                        startScreen.appendChild(paragraph2)

                        // create button
                        buttonStart = document.createElement('button')
                        buttonStart.innerText = 'START'
                        // Assign the style object to buttonStart
                        Object.assign(buttonStart.style, buttonStartStyle)

                        startScreen.appendChild(buttonStart)

                        buttonStart.addEventListener('click', handleGameStart)
                    }
                }
                window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
            })
            .initial()
            .onTrigger(endGame, 'gameOver')
            .onTrigger(startGame, 'gameStart')
            .onExit(() => {
                // delete onboarding UI
                if (buttonStart) {
                    buttonStart.removeEventListener('click', handleGameStart)
                    buttonStart.parentNode.removeChild(buttonStart)
                }
                if (startScreen) {
                    startScreen.parentNode.removeChild(startScreen)
                }
                if (flexWrapper) {
                    flexWrapper.parentNode.removeChild(flexWrapper)
                }
            })

        ecs.defineState('gameStart')
            .onEnter(() => {
                world.events.dispatch(world.events.globalId, 'gameStart', {
                    newState: 'gameStart',
                })

                const collectedCoins = JSON.parse(localStorage.getItem('collectedCoins')) || []
                const collectedCoinsCount = collectedCoins.length

                if (collectedCoinsCount >= 3) {
                    const timer2 = setTimeout(() => {
                        endGame.trigger()
                        clearTimeout(timer2)
                    }, 1000)
                }
            })
            .onTrigger(endGame, 'gameOver')

        ecs.defineState('gameOver')
            .onEnter(() => {
                world.events.dispatch(world.events.globalId, 'stateChanged', {
                    newState: 'gameOver',
                })

                flexWrapper = document.createElement('div')
                Object.assign(flexWrapper.style, divContainerStyle)
                document.body.appendChild(flexWrapper)

                finalScreen = document.createElement('div')

                // Assign the style to startScreen
                Object.assign(finalScreen.style, screenContainerStyle)
                flexWrapper.appendChild(finalScreen)

                // create h1
                const header = document.createElement('h1')
                header.textContent = 'Wow,'
                // Assign the style to startScreen
                Object.assign(header.style, headerStyle)
                finalScreen.appendChild(header)

                // create p
                const paragraph1 = document.createElement('p')
                paragraph1.innerHTML = '<b>Je hebt al de Miefel-munten gevonden!</b>'
                finalScreen.appendChild(paragraph1)

                // create p
                const paragraph2 = document.createElement('p')
                paragraph2.innerHTML = 'We kunnen je nu het geheime wachtwoord verklappen! Hiermee kun je bij het infopunt een speciale sticker ophalen.'
                finalScreen.appendChild(paragraph2)

                // secret word
                const secret = document.createElement('div')
                finalScreen.appendChild(secret)

                const secretStyle = {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                }
                Object.assign(secret.style, secretStyle)

                const paragraphSecret = document.createElement('p')
                paragraphSecret.innerHTML = '<i>Het geheime woord is...</i>'
                const paragraphSecretStyle = {
                    fontSize: '1rem',
                    textAlign: 'center',
                }
                Object.assign(paragraphSecret.style, paragraphSecretStyle)
                secret.appendChild(paragraphSecret)

                const wordSecret = document.createElement('p')
                wordSecret.innerHTML = 'knuffelmonster'

                const wordSecretStyle = {
                    fontSize: '2rem',
                    fontWeight: '700',
                    textAlign: 'center',
                }
                Object.assign(wordSecret.style, wordSecretStyle)
                secret.appendChild(wordSecret)
            })

        // Initialize the game by transitioning to 'gameStart' state
        const initializeGame = () => {
            updateStatus(0)  // Set initial coin count to 0
        }

        // Listen for the 'coinCollected' event
        world.events.addListener(world.events.globalId, 'coinCollected', (eventData) => {
            const { collectedCoinsCount, coin } = eventData.data
            updateStatus(collectedCoinsCount)
            showStory(coin, collectedCoinsCount)
        })

        // Add an event listener to handle the state change
        world.events.addListener(world.events.globalId, 'stateChanged', (eventData) => {
            const { newState } = eventData.data
        })

        // Initialize game
        initializeGame()
    },

})
