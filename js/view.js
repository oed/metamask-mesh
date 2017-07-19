const h = require('virtual-dom/virtual-hyperscript')

module.exports = render

function render(state, actions) {
  return (

    h('div', [

      h('div.header', [
        h('a', {
          'attributes': {
            'href': 'https://ipfs.io',
            'target': '_blank'
          }
        }, [
          h('img#logo', {
            'attributes': {
              'src': 'ipfs-logo.svg',
              'height': '32'
            },
            'id': {
              'name': 'id',
              'value': 'logo'
            }
          })
        ]),
      ]),

      h('div.wrapper', [
        h('div#ipfs.ipfs', [

          // block bridging
          h('#bridge-control.panel', [
            h('h2', 'Eth-IPFS bridge via RPC'),

            h('div', 'best block:'),
            state.bestBlock ? renderBlock(state.bestBlock) : h('div', '(none)'),

            h('button#start', {
              'attributes': {
                'type': 'button',
                'disabled': !state.isRpcSyncing ? undefined : true,
              },
              onclick: actions.startTracker,
            }, `Start`),
            `
              `,
            h('button#stop', {
              'attributes': {
                'disabled': state.isRpcSyncing ? undefined : true,
                'type': 'button'
              },
              onclick: actions.stopTracker,
            }, `Stop`),
          ]),

          // block inventory
          h('#block-container.panel', [
            state.blocks.slice().reverse().map(renderBlock)
          ]),

          // data lookups
          h('#query-container.panel', [
            // h('h2', `Resolve from network`),

            //
            // general query
            //

            h('h2.space-top', 'Query lookup'),

            // pseudo path
            h('input#eth-pseudo-query', {
              'attributes': {
                'type': 'text',
                'placeholder': 'eth-ipfs pseudo path',
                'value': state.pseudoQuery,
              },
              oninput: (event) => actions.setPseudoQuery(event.target.value),
            }),

            // dag path
            h('input#ipfs-dag-query', {
              'attributes': {
                'type': 'text',
                'placeholder': 'CID/path/to/data',
                'value': state.dagQuery,
              }
            }),

            h('button', {
              'attributes': {
                'disabled': state.bestBlock ? undefined : true,
                'type': 'button'
              },
              onclick: (event) => {
                const input = document.querySelector('#ipfs-dag-query')
                actions.resolveIpldPath(input.value)
              },
            }, `Perform Query`),

            // dag result
            h('input#ipfs-dag-result', {
              type: 'text',
              disabled: true,
            }),

          ]),

          h('#token-container.panel', [

            //
            // token balance
            //

            h('h2.space-top', 'Gnosis Token balance'),

            // token holder address
            h('input#token-query', {
              'attributes': {
                'type': 'text',
                'placeholder': 'eth-ipfs pseudo path',
                'value': state.tokenHolder,
              },
              oninput: (event) => actions.setTokenHolder(event.target.value),
            }),

            // initiate lookup
            h('button', {
              'attributes': {
                'disabled': state.bestBlock ? undefined : true,
                'type': 'button'
              },
              onclick: actions.lookupTokenBalance,
            }, `Lookup Gnosis Balance`),

            // cid path
            h('input#token-result', {
              type: 'text',
              disabled: true,
            }),

          ]),

          h('#ens-container.panel', [

            //
            // ens lookup
            //

            h('h2.space-top', 'ENS lookup'),

            // ens name
            h('input#ens-query', {
              'attributes': {
                'type': 'text',
                'placeholder': 'eth-ipfs pseudo path',
                'value': state.ensName,
              },
              oninput: (event) => actions.setENSName(event.target.value),
            }),

            // initiate lookup
            h('button', {
              'attributes': {
                'disabled': state.bestBlock ? undefined : true,
                'type': 'button'
              },
              onclick: actions.lookupENSRecord,
            }, `Preform ENS Lookup`),

            // cid path
            h('input#ens-result', {
              type: 'text',
              disabled: true,
            }),

          ]),

          // peer status
          h('div.left.panel', [
            h('div#details'+ state.peerInfo.addresses ? '' : '.disabled', [
              h('h2', `Your daemon`),
              h('h3', `ID`),
              h('pre.id-container', state.peerInfo.id),
              h('h3', `Addresses`),
              h('ul.addresses-container', [(
                state.peerInfo.addresses ?
                  state.peerInfo.addresses.map((address) => h('li', [h('span.address', address)]))
                : h('li', `Not yet online`)
              )])
            ])
          ]),
          h('div.right.panel', [
            h('div#peers'+ state.peers.length ? '' : '.disabled', [
              h('h2', 'Remote Peers'),
              (
                state.peers.length ?
                  h('ul', state.peers.map((peer) => {
                    const address = peer.addr.toString()
                    return (
                      h('li', [
                        h('button.disconnect-peer', {
                          attributes: {
                            'data-address': address,
                            disabled: peer.isDisconnecting,
                          },
                          onclick: actions.disconnectFromPeer,
                        }, 'x'),
                        h('span.address', address),
                      ])
                    )
                  })
                )
                : h('i', 'Waiting for peers...')
              ),
            ]),
            h('div', [
              h('input.connect-peer', {
                'attributes': {
                  'disabled': state.peerInfo.addresses ? undefined : true,
                  'type': 'text',
                  'placeholder': 'Multiaddr',
                }
              }),
              `
                `,
              h('button.connect-peer', {
                disabled: state.peerInfo.addresses ? undefined : true,
                onclick: actions.connectToPeer,
              }, `Connect to peer`)
            ])
          ]),
          h('div.clear'),

          // errors
          h('pre#errors',
            state.error
          ),
        ])
      ])

    ])
  )
}

function renderBlock(block) {
  const number = parseInt(block.number)
  return h('div', `block: #${number}  ${block.cid}`)
}
