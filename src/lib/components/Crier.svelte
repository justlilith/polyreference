<script lang='ts'>
  import * as Crier from '$lib/ts/crier'
  
  let val = Crier.currentNotification
  
  // Crier.send({notification:`Sweet!`})

  Crier.store.subscribe((update) => {
    val = update.notifications[0] ?? ""
  })

  /**
   * Crier should be a queue
   * There should be a func that displays the top of the queue
   * It should be on an interval
  */
</script>

<span>{val}</span>
<button on:click='{()=>{Crier.send({notification:`nice! + ${Date.now()}`})}}'></button>

<style lang='scss'>
  
</style>