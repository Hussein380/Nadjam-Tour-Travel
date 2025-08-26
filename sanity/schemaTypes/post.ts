import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: rule => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: rule => rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'hero',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                { name: 'alt', type: 'string', title: 'Alt text' }
            ]
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Meta Title' },
                { name: 'description', type: 'text', title: 'Meta Description', rows: 2 },
                { name: 'canonical', type: 'url', title: 'Canonical URL' },
                { name: 'noindex', type: 'boolean', title: 'Noindex' },
                { name: 'ogImage', type: 'image', title: 'OpenGraph Image' }
            ]
        })
    ],
    preview: {
        select: {
            title: 'title',
            media: 'hero',
            subtitle: 'publishedAt'
        }
    }
})


