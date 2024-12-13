import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
    name: 'game',
    schema: {
        onboardingUI: ecs.eid,  // onboarding UI
        startButton: ecs.eid,  // startButton
        uiTextElement: ecs.eid,  // UI element for displaying coin count
        storyUI: ecs.eid,  // storytelling UI
        gameOverUI: ecs.eid,  // show this screen to us to get the sticker
    },
    stateMachine: ({ world, eid, schemaAttribute }) => {
        const { uiTextElement, gameOverUI, onboardingUI, storyUI, startButton } = schemaAttribute.get(eid)

        const endGame = ecs.defineTrigger()
        const startGame = ecs.defineTrigger()

        // Update the UI text
        const updateUIText = (collectedCoinsCount) => {
            ecs.Ui.mutate(world, uiTextElement, (cursor) => {
                // cursor.text = `${collectedCoinsCount}/3 Coins Collected`
                cursor.opacity = (collectedCoinsCount > 0) ? 1.0 : 0.3
            })
        }

        const handleGameStart = () => {
            startGame.trigger()
        }

        // Define game states
        ecs.defineState('onboarding')
            .onEnter(() => {
                // Hide GameOver UI
                ecs.Hidden.set(world, gameOverUI, {})
                // Hide storyUI
                ecs.Hidden.set(world, storyUI, {})
                // add eventlistener to the button
                world.events.addListener(startButton, ecs.input.SCREEN_TOUCH_START, handleGameStart)
            })
            .initial()
            .onTrigger(startGame, 'gameStart')
            .onExit(() => {
                // delete onboarding UI
                world.events.removeListener(startButton, ecs.input.SCREEN_TOUCH_START, handleGameStart)
                world.deleteEntity(onboardingUI)
                world.deleteEntity(startButton)
            })

        ecs.defineState('gameStart')
            .onEnter(() => {
                console.log('game started')
                world.events.dispatch(world.events.globalId, 'gameStart', {
                    newState: 'gameStart',
                })
                // hide onboardingUI
                // ecs.Hidden.set(world, onboardingUI, {})
                // hide button
                // ecs.Hidden.set(world, startButton, {})

                const collectedCoins = JSON.parse(localStorage.getItem('collectedCoins')) || []
                updateUIText(collectedCoins.length)
            })
            .onTrigger(endGame, 'gameOver')

        ecs.defineState('gameOver')
            .onEnter(() => {
                world.events.dispatch(world.events.globalId, 'stateChanged', {
                    newState: 'gameOver',
                })
                ecs.Hidden.remove(world, gameOverUI)
                console.log(gameOverUI)
            })

        // Initialize the game by transitioning to 'gameStart' state
        const initializeGame = () => {
            updateUIText(0)  // Set initial coin count to 0
        }

        // Listen for the 'coinCollected' event
        world.events.addListener(world.events.globalId, 'coinCollected', (eventData) => {
            console.log('I am here')
            const { collectedCoinsCount } = eventData.data
            updateUIText(collectedCoinsCount)
            // If 3 coins are collected, trigger gameOver
            if (collectedCoinsCount >= 3) {
                endGame.trigger()
            }
        })

        // Add an event listener to handle the state change
        world.events.addListener(world.events.globalId, 'stateChanged', (eventData) => {
            const { newState } = eventData.data
            console.log(newState)
        })

        // Initialize game
        initializeGame()
    },
})
