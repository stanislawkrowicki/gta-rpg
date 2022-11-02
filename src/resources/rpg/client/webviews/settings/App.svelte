<script lang="ts">
    import AccountSettings from './AccountSettings.svelte'
    import BindsSettings from './BindsSettings.svelte'
    import PreferencesSettings from './PreferencesSettings.svelte'

    import { settingsPanel as trans } from 'lang'

    type SectionKey = 'account' | 'binds' | 'preferences'

    let selectedSection: SectionKey = 'account'

    const selectSection = (sectionToSelect: SectionKey) => {
        selectedSection = sectionToSelect
    }
</script>

<main>
    <nav>
        <ul>
            <li
                class={selectedSection === 'account' ? 'selected' : ''}
                on:click={() => selectSection('account')}
            >
                <div class="inner">
                    {trans.account}
                </div>
            </li>
            <li
                class={selectedSection === 'binds' ? 'selected' : ''}
                on:click={() => selectSection('binds')}
            >
                <div class="inner">
                    {trans.binds}
                </div>
            </li>
            <li
                class={selectedSection === 'preferences' ? 'selected' : ''}
                on:click={() => selectSection('preferences')}
            >
                <div class="inner">
                    {trans.preferences}
                </div>
            </li>
        </ul>
    </nav>

    {#if selectedSection === 'account'}
        <div class="section section-account">
            <AccountSettings />
        </div>
    {:else if selectedSection === 'binds'}
        <div class="section section-binds">
            <BindsSettings />
        </div>
    {:else if selectedSection === 'preferences'}
        <div class="section section-preferences">
            <PreferencesSettings />
        </div>
    {/if}
</main>

<style lang="scss">
    @import '../components/theme.scss';

    main {
        width: 40vw;
        height: 60vh;
        margin: auto;
        margin-top: 10vh;
        opacity: 0.95;
        font-family: Roboto, sans-serif;
        font-weight: 600;
    }

    nav {
        margin-bottom: 0;

        ul {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            color: white;
            background-color: #333;
            margin: 0;

            li {
                list-style-type: none;
                background-image: linear-gradient(to right, $THEME-COLOR-A, $THEME-COLOR-B);
                cursor: pointer;
                user-select: none;

                &.selected .inner {
                    padding-bottom: 0.2em;
                }
                &:hover {
                    .inner {
                        padding-bottom: 0.3em;
                    }
                }

                .inner {
                    background-color: #333;
                    height: auto;
                    width: auto;
                    padding: 0.5em;
                    transition: all 0.2s ease-in-out;
                }
            }
        }
    }

    .section {
        background-color: #222;
        width: 100%;
        height: 100%;
        margin: 0;
    }
</style>
