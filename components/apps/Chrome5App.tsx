import React, { useState, useEffect, useRef } from 'react';
import { AppDefinition, AppComponentProps } from '../../types';
import { Browser5Icon } from '../../constants';

type Status = 'Connecting...' | 'Connected' | 'Disconnected' | 'Error';

const Chrome5App: React.FC<AppComponentProps> = ({ setTitle: setWindowTitle }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<Status>('Connecting...');

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.launchExternal('components/apps/Chrome5');
        } else {
            console.warn('electronAPI not available. Cannot launch Chrome5 backend.');
            setStatus('Error');
            return;
        }

        const connectWebSocket = () => {
            wsRef.current = new WebSocket('ws://localhost:8081');
            setStatus('Connecting...');

            wsRef.current.onopen = () => {
                console.log('Chrome5 WebSocket connected.');
                setStatus('Connected');
                setWindowTitle('Chrome 5');
            };

            wsRef.current.onmessage = (event) => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                if (event.data instanceof Blob) {
                    if (status !== 'Connected') setStatus('Connected');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    const image = new Image();
                    image.onload = () => {
                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.drawImage(image, 0, 0);
                        URL.revokeObjectURL(image.src);
                    };
                    image.src = URL.createObjectURL(event.data);
                } else {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'size') {
                            canvas.width = data.width;
                            canvas.height = data.height;
                        }
                    } catch (e) {
                        // console.error('Failed to parse WebSocket message:', e);
                    }
                }
            };

            wsRef.current.onclose = () => {
                console.log('Chrome5 WebSocket disconnected.');
                setStatus('Disconnected');
            };

            wsRef.current.onerror = (error) => {
                console.error('Chrome5 WebSocket error:', error);
                setStatus('Error');
            };
        };

        const timeoutId = setTimeout(connectWebSocket, 1500); // Increased delay

        return () => {
            clearTimeout(timeoutId);
            wsRef.current?.close();
        };
    }, [setWindowTitle, status]);

    const sendInput = (payload: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'input', payload }));
        }
    };

    const handleMouseEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let type: string = e.type;
        if (e.type === 'mousedown') type = 'mouseDown';
        if (e.type === 'mouseup') type = 'mouseUp';
        if (e.type === 'mousemove') type = 'mouseMove';

        const button = e.button === 0 ? 'left' : e.button === 1 ? 'middle' : 'right';

        sendInput({ type, x, y, button, clickCount: e.detail });
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
    };

    const handleWheelEvent = (e: React.WheelEvent<HTMLCanvasElement>) => {
        sendInput({ type: 'mouseWheel', deltaX: e.deltaX, deltaY: e.deltaY, x: e.clientX, y: e.clientY });
    };

    const handleKeyEvent = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        let type = e.type === 'keydown' ? 'keyDown' : 'keyUp';
        sendInput({ type, keyCode: e.key, modifiers: [] }); // Simplified
    };

    return (
        <div className="flex flex-col h-full bg-black">
            <div className="flex-grow relative">
                {status !== 'Connected' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-2xl z-10">
                        {status}
                    </div>
                )}
                {window.electronAPI ? (
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        onMouseDown={handleMouseEvent}
                        onMouseUp={handleMouseEvent}
                        onMouseMove={handleMouseEvent}
                        onContextMenu={handleContextMenu}
                        onWheel={handleWheelEvent}
                        onKeyDown={handleKeyEvent}
                        onKeyUp={handleKeyEvent}
                        tabIndex={0}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400">
                        This feature is only available in the Electron version of the app.
                    </div>
                )}
            </div>
        </div>
    );
};

export const appDefinition: AppDefinition = {
  id: 'chrome5',
  name: 'Chrome 5',
  icon: Browser5Icon,
  component: Chrome5App,
  defaultSize: { width: 1024, height: 768 },
  isPinnedToTaskbar: true,
};

export default Chrome5App;
