<script lang="ts">
    export let author = ""
    export let message = ""
</script>

<style>
    .message {
        color: white;
    }
    .author {
        display: inline-block;
    }
    .author:after {
        content: ": ";
    }
    .message-content {
        display: inline-block;
    }
</style>

<div class="message">
    <div class="author">{author}</div><div class="message-content">{message}</div>
</div>