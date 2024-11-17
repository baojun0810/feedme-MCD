import React, { useEffect, useRef } from 'react';
import { DraggingItem, SiteMaps } from '../pages/MapPage';
import { DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type Props = {
	siteMapLength: number;
	siteMap: SiteMaps;
	recursiveRender: (sitemap: SiteMaps[], parentId: number) => JSX.Element[];
	draggingItem: DraggingItem | null;
	index: number;
	parentId: number;
};

const TreeLeaf = (props: Props) => {
	const { isOver: isOver, setNodeRef: drop } = useDroppable({
		id: props.siteMap.id,
		data: {
			action: 'CENTER',
		},
	});

	const { isOver: isOverLeft, setNodeRef: dropLeft } = useDroppable({
		id: `left-${props.siteMap.id}`,
		data: {
			action: 'LEFT',
			id: props.siteMap.id,
		},
	});

	const { isOver: isOverRight, setNodeRef: dropRight } = useDroppable({
		id: `right-${props.siteMap.id}`,
		data: {
			action: 'RIGHT',
			id: props.siteMap.id,
		},
	});

	const {
		attributes,
		listeners,
		setNodeRef: drag,
		transform,
		isDragging,
	} = useDraggable({
		id: props.siteMap.id,
		data: {
			sitemap: props.siteMap,
		},
	});

	return (
		<li
			className={`relative ${
				props.siteMapLength < 2 ? 'before:hidden' : ''
			} before:content-[""] first:before:w-[50%] last:before:w-[50%] before:w-[100%] before:h-px before:absolute before:bg-gray-400 before:-top-2.5 first:before:left-[50%] last:before:right-[50%] before:left-0 after:content-[""] after:w-px after:h-2.5 after:absolute after:bg-gray-400 after:-top-2.5 after:left-[50%] after:translate-x-[-50%]`}
		>
			<div className='flex justify-center mb-5'>
				<div
					className={`${
						isOverLeft &&
						!props.draggingItem?.children.includes(props.siteMap.id)
							? 'bg-gray-400 w-[200px] mr-3'
							: 'w-1.5'
					}`}
					ref={dropLeft}
				></div>
				<div
					ref={drag}
					{...attributes}
					{...listeners}
					className={`w-[200px] break-words border border-solid border-gray-400 px-1.5 py-6 relative ${
						props.siteMap.children.length > 0
							? 'after:content-[""] after:w-px after:h-2.5 after:absolute after:bg-gray-400 after:-bottom-2.5 after:left-[50%] after:translate-x-[-50%]'
							: ''
					} ${
						isOver &&
						!props.draggingItem?.children.includes(props.siteMap.id)
							? 'bg-gray-400'
							: ''
					}`}
				>
					<p className='text-center pointer-events-none'>
						{props.siteMap.title}
					</p>
					<div
						ref={drop}
						className={`absolute top-0 left-0 w-full h-full ${
							isDragging ? 'z-50' : ''
						}`}
					/>
				</div>
				<div
					className={`${
						isOverRight &&
						!props.draggingItem?.children.includes(props.siteMap.id)
							? 'bg-gray-400 w-[200px] ml-3'
							: 'w-1.5'
					}`}
					ref={dropRight}
				></div>
			</div>
			<ul className='flex'>
				{props.siteMap.children.length > 0 ? (
					props.recursiveRender(
						props.siteMap.children,
						props.siteMap.id
					)
				) : (
					<></>
				)}
			</ul>
		</li>
	);
};

export default TreeLeaf;
