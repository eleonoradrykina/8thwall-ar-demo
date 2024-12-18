import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
    name: 'coin',
    schema: {
        coinId: ecs.string,  // Unique ID for each coin, this is string in case I want to use names for storytelliing later
    },
    schemaDefaults: {},
    data: {
        // enabled: ecs.boolean,
    },
    add: (world, component) => {
        const { eid, schemaAttribute } = component

        const { coinId } = schemaAttribute.get(eid)

        // console.log(JSON.parse(localStorage.getItem('collectedCoins')))

        const click = () => {
            // Update localStorage with the collected coin using coinId
            const collectedCoins = JSON.parse(localStorage.getItem('collectedCoins')) || []

            // Initialize localStorage with an empty array if it doesn't exist
            if (!localStorage.getItem('collectedCoins')) {
                localStorage.setItem('collectedCoins', JSON.stringify([]))
            }

            if (!collectedCoins.includes(coinId)) {
                collectedCoins.push(coinId)
                localStorage.setItem('collectedCoins', JSON.stringify(collectedCoins))

                // First animation: Scale to 0 with Elastic easing
                ecs.ScaleAnimation.set(world, eid, {
                    autoFrom: true,
                    toX: 0,
                    toY: 0,
                    toZ: 0,
                    loop: false,
                    duration: 1500,
                    easeOut: true,
                    easingFunction: 'Elastic',
                })

                // Dispatch an event to notify the game of the collection
                world.events.dispatch(world.events.globalId, 'coinCollected', {
                    collectedCoinsCount: collectedCoins.length,
                    coin: coinId,
                })
            }
        }

        // Add the click event listener
        world.events.addListener(eid, ecs.input.SCREEN_TOUCH_START, click)
    },
    tick: (world, component) => {
        // Add any per-frame logic if needed
    },
    remove: (world, component) => {
        // Cleanup logic when the component is removed
    },
})
