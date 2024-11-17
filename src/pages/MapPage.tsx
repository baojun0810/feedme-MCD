import React, { Children, useState } from 'react';
import TreeLeaf from '../components/TreeLeaf';
import {
	closestCenter,
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	pointerWithin,
} from '@dnd-kit/core';

export type SiteMaps = {
	id: number;
	title: string;
	children: SiteMaps[]; // Recursive type: each child is also a Page
};

export type DraggingItem = {
	title: string;
	children: number[];
};

const MapPage = () => {
	const [sitemaps, setSitemaps] = useState<SiteMaps>({
		id: 1,
		title: 'Item A',
		children: [
			{
				id: 2,
				title: 'Item B',
				children: [],
			},
			{
				id: 3,
				title: 'Item C',
				children: [],
			},
			{
				id: 4,
				title: 'Item D',
				children: [
					{
						id: 5,
						title: 'Item E',
						children: [
							{
								id: 11,
								title: 'Item K',
								children: [],
							},
							{
								id: 12,
								title: 'Item L',
								children: [],
							},
						],
					},
					{
						id: 6,
						title: 'Item F',
						children: [],
					},
				],
			},
			{
				id: 7,
				title: 'Item G',
				children: [
					{
						id: 8,
						title: 'Item H',
						children: [
							{
								id: 9,
								title: 'Item I',
								children: [
									{
										id: 10,
										title: 'Item J',
										children: [],
									},
								],
							},
						],
					},
				],
			},
		],
	});

	const [draggingItem, setDraggingItem] = useState<DraggingItem | null>(null);

	function handleDragStart(event: DragStartEvent) {
		if (event.active.data.current) {
			const sitemap = event.active.data.current.sitemap;

			setDraggingItem(() => ({
				title: sitemap.title,
				children: getChildrenId(sitemap),
			}));
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		if (
			!event.over ||
			draggingItem?.children.includes(event.over.id as number)
		)
			return;

		setSitemaps((prev) => {
			let updatedSitemap = removeNode(prev, event.active.id as number);

			if (event.over!.data.current!.action === 'CENTER') {
				updatedSitemap = addSubNode(
					updatedSitemap,
					event.over!.id as number,
					event.active.data.current!.sitemap
				);
			} else if (event.over!.data.current!.action === 'LEFT') {
				updatedSitemap = addSideNode(
					updatedSitemap,
					event.over!.data.current!.id,
					event.active.data.current!.sitemap,
					'LEFT'
				);
			} else if (event.over!.data.current!.action === 'RIGHT') {
				updatedSitemap = addSideNode(
					updatedSitemap,
					event.over!.data.current!.id,
					event.active.data.current!.sitemap,
					'RIGHT'
				);
			}

			return updatedSitemap;
		});

		setDraggingItem(() => null);
	}

	const recursiveRender = (sitemap: SiteMaps[], parentId: number) => {
		return sitemap.map((item, index) => (
			<TreeLeaf
				key={item.id}
				siteMapLength={sitemap.length}
				parentId={parentId}
				siteMap={item}
				index={index}
				recursiveRender={recursiveRender}
				draggingItem={draggingItem}
			/>
		));
	};

	const getChildrenId = (sitemap: SiteMaps): number[] => {
		return [sitemap.id, ...sitemap.children.flatMap(getChildrenId)];
	};

	const removeNode = (sitemap: SiteMaps, target: number) => {
		let deleted = false;

		const recursive = (obj: SiteMaps) => {
			if (deleted && obj.children.length === 0) return obj;

			const found = obj.children.find((item) => item.id === target);

			if (found) {
				if (found.id === target) {
					deleted = true;
					const children = obj.children.filter(
						(item) => item.id !== target
					);

					return { ...obj, children: children };
				}
			}

			const children: SiteMaps[] = obj.children.map((x) => recursive(x));

			return { ...obj, children: children };
		};

		const updatedSitemap = recursive(sitemap);

		return updatedSitemap;
	};

	const addSubNode = (
		sitemap: SiteMaps,
		target: number,
		moveItem: SiteMaps
	) => {
		let added = false;

		const recursive = (obj: SiteMaps) => {
			if (added) return obj;

			if (obj.id === target) {
				return { ...obj, children: [...obj.children, moveItem] };
			}

			const children: SiteMaps[] = obj.children.map((x) => recursive(x));

			return { ...obj, children: children };
		};

		const updatedSitemap = recursive(sitemap);

		return updatedSitemap;
	};

	const addSideNode = (
		sitemap: SiteMaps,
		target: number,
		moveItem: SiteMaps,
		side: 'LEFT' | 'RIGHT'
	) => {
		let added = false;

		const recursive = (obj: SiteMaps) => {
			if (added) return obj;

			const index = obj.children.findIndex((x) => x.id === target);
			if (index !== -1) {
				if (side === 'LEFT') {
					return {
						...obj,
						children: [
							...obj.children.slice(0, index),
							moveItem,
							...obj.children.slice(index),
						],
					};
				} else {
					return {
						...obj,
						children: [
							...obj.children.slice(0, index + 1),
							moveItem,
							...obj.children.slice(index + 1),
						],
					};
				}
			}

			const children: SiteMaps[] = obj.children.map((x) => recursive(x));

			return { ...obj, children: children };
		};

		const updatedSitemap = recursive(sitemap);
		console.log(updatedSitemap);
		return updatedSitemap;
	};

	return (
		<div className='w-full p-8'>
			<div className='mx-auto flex justify-center'>
				<ul className='flex'>
					<li className=''>
						<div className='w-[200px] break-words mx-auto border border-solid border-gray-400 px-1.5 py-6 mb-5 relative after:content-[""] after:w-px after:h-2.5 after:absolute after:bg-gray-400 after:-bottom-2.5 after:left-[50%] after:translate-x-[-50%]'>
							<p className='text-center'>{sitemaps.title}</p>
						</div>
						<DndContext
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							collisionDetection={pointerWithin}
						>
							<DragOverlay dropAnimation={null}>
								{draggingItem ? (
									<div
										className={`w-[200px] break-words mx-auto border border-solid border-gray-400 px-1.5 py-6 mb-5 relative`}
									>
										<p className='text-center pointer-events-none'>
											{draggingItem.title}
										</p>
									</div>
								) : null}
							</DragOverlay>
							<ul className='flex'>
								{recursiveRender(
									sitemaps.children,
									sitemaps.id
								)}
							</ul>
						</DndContext>
					</li>
				</ul>
			</div>
			<div></div>
		</div>
	);
};

export default MapPage;

const a = [
	{
		id: 1,
		children: [
			{
				id: 2,
				children: [],
			},
			{
				id: 3,
				children: [
					{
						id: 4,
						children: [],
					},
					{
						id: 5,
						children: [],
					},
				],
			},
			{
				id: 6,
				children: [],
			},
		],
	},
];
