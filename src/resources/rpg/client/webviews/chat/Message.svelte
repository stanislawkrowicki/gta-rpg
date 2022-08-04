<script lang="ts">
    export let author = ""
    export let message = ""
</script>

<style>
    .author {

    }
    .author:after {
        content: ": ";
    }
    .message {

    }
</style>

<div>
    <div class="author">{author}</div><div class="message">{message}</div>
</div>