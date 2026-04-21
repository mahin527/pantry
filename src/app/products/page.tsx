"use client"
import React from 'react'
import Sidebar from '@/components/Sidebar'
import { Button } from '@mui/material'
import { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductItems from '@/components/ProductItems'
import Pagination from '@mui/material/Pagination';

function ProductsPage() {
    const [sortBy, setSortBy] = useState("Name, A To Z")

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <section className='py-4 bg-gray-50'>
                <div className="container py-4 flex gap-6">
                    <div className='sidebar-wrapper w-[20%]'>
                        <Sidebar />
                    </div>
                    <div className='product-wrapper w-[80%] tracking-wider text-gray-600'>
                        <div className='top-strip sticky top-5 z-10 w-full bg-white shadow-md flex items-center justify-between py-3 lg:py-4 xl:py-5 px-6 rounded-md'> {/**  dark:bg-white/10 */}
                            <p className='font-bold'>
                                There are 25 products
                            </p>
                            <div className='flex items-center gap-3'>
                                <p className='font-bold'>
                                    Sort By
                                </p>
                                <div className="relative">
                                    <Button
                                        variant="outlined"
                                        className='font-bold!'
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}>
                                        {sortBy}
                                    </Button>

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    color: "#57585b",
                                                },
                                            },
                                            list: {
                                                'aria-labelledby': 'basic-button',
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Name, Z TO A</MenuItem>
                                        <MenuItem onClick={handleClose}>Name, A TO Z</MenuItem>
                                        <MenuItem onClick={handleClose}>Price, Low To High</MenuItem>
                                        <MenuItem onClick={handleClose}>Price, High To Low </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <div className='py-6 px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5'>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item, index) => (
                                    <ProductItems key={index} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Pagination count={10} color="primary" />
                </div>
            </section>
        </>
    )
}

export default ProductsPage