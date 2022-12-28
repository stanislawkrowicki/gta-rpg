<script lang="ts">
    export let author = ''
    export let message = ''
</script>

<div class="message">
    <div class="author">{author}</div>
    <div class="message-content">{message}</div>
</div>

<style>
    .message {
        color: white;
        padding: 2px;
    }
    .author {
        display: inline-block;
    }
    .author:after {
        content: ': ';
    }
    .message-content {
        display: inline-block;
    }
</style>
