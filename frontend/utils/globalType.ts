// Message data structure
export interface Message {
    time: Date | number,
    from: string | null,
    mssg: string,
}

export interface RoomMessage extends Message {
    roomName: string | undefined
}