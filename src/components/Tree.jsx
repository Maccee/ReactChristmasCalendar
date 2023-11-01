import React, { useState, useEffect, useCallback } from 'react';

const TREE_IMAGE_DEFAULT = './src/assets/joulukuusi.png';
const TREE_IMAGE_LIGHTS = './src/assets/joulukuusil.png';
const TREE_IMAGE_GARLAND = './src/assets/joulukuusilg.png';

const Decoration = ({ decoration, onDragStart, defaultTop }) => {
    const decorationStyles = {
        width: decoration.type === 'star.svg' ? '100px' : '50px',
        height: decoration.type === 'star.svg' ? '100px' : '50px',
        zIndex: 10,
        position: 'absolute',
        left: decoration.x ? `${decoration.x - (decoration.type === 'star.svg' ? 50 : 25)}px` : `60px`,
        top: decoration.y ? `${decoration.y - (decoration.type === 'star.svg' ? 50 : 25)}px` : defaultTop
    };

    return (
        <img
            src={`./src/assets/${decoration.type}`}
            alt={decoration.type}
            draggable
            onDragStart={onDragStart}
            style={decorationStyles}
        />
    );
};

const Tree = () => {
    const [treeImage, setTreeImage] = useState(TREE_IMAGE_DEFAULT);
    const [decorations, setDecorations] = useState([]);

    useEffect(() => {
        const storedDecorations = JSON.parse(localStorage.getItem('decorations') || '[]');
        setDecorations(storedDecorations);

        if (storedDecorations.some(decoration => decoration.type === 'lights1.svg')) {
            setTreeImage(TREE_IMAGE_LIGHTS);
        }
        if (storedDecorations.some(decoration => decoration.type === 'garland.svg')) {
            setTreeImage(TREE_IMAGE_GARLAND);
        }
    }, []);

    const handleDragStart = useCallback((e, id) => {
        console.log("Drag started for id:", id);
        e.dataTransfer.setData('decorationId', id);
    }, [decorations]);

    const handleDrop = useCallback((e) => {
        const decorationId = e.dataTransfer.getData('decorationId');
        if (!decorationId) return;

        const decorationIndex = decorations.findIndex(deco => deco.id === decorationId);
        if (decorationIndex === -1) return;

        const decoration = decorations[decorationIndex];
        const updatedDecorations = [...decorations];
        updatedDecorations[decorationIndex] = { ...decoration, x: e.clientX, y: e.clientY };

        setDecorations(updatedDecorations);
        localStorage.setItem('decorations', JSON.stringify(updatedDecorations));
    }, [decorations]);

    return (
        <div className="tree-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <img src={treeImage} alt="Christmas Tree" style={{ width: '700px', zIndex: 1 }} />
            {decorations
                .filter(deco => !['garland.svg', 'lights1.svg'].includes(deco.type))
                .map((decoration, index) => (
                    <Decoration
                        key={decoration.id}  // Using the decoration's id as key
                        decoration={decoration}
                        onDragStart={(e) => handleDragStart(e, decoration.id)}  // Passing the decoration's id
                        defaultTop={`${60 + (index * 60)}px`}
                    />
                ))
            }
        </div>
    );
}

export default Tree;
