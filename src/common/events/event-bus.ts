import { EventEmitter } from "node:events";
import type { PlotItEvents } from "./event.types";

/**
 * A strictly-typed wrapper around Node's native EventEmitter.
 * Prevents magic strings and ensures payload contracts are respected.
 */
class TypedEventBus {
    private emitter = new EventEmitter();

    /**
     * Broadcast an event to the rest of the application non-blockingly.
     */
    emit<K extends keyof PlotItEvents>(eventName: K, payload: PlotItEvents[K]): void {
        this.emitter.emit(eventName, payload);
    }

    /**
     * Listen to an event occurring anywhere in the application.
     */
    on<K extends keyof PlotItEvents>(
        eventName: K, 
        listener: (payload: PlotItEvents[K]) => void
    ): void {
        this.emitter.on(eventName, listener);
    }

    off<K extends keyof PlotItEvents>(
        eventName: K, 
        listener: (payload: PlotItEvents[K]) => void
    ): void {
        this.emitter.off(eventName, listener);
    }
}

// Export as a singleton for the entire backend
export const eventBus = new TypedEventBus();
