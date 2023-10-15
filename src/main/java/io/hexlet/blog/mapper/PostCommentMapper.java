package io.hexlet.blog.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import io.hexlet.blog.dto.PostCommentDTO;
import io.hexlet.blog.model.PostComment;

@Mapper(
    // uses = { JsonNullableMapper.class, ReferenceMapper.class },
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class PostCommentMapper {
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "post.id", target = "postId")
    public abstract PostCommentDTO map(PostComment model);
}

